import katex from "katex";
import { useRef } from "react";
import React, { useState } from "react";
import { MoreVertical, Download, FileText, Edit, Share2, Trash2, ChevronRight } from "lucide-react";
import { Card as ShadCard, CardContent, CardTitle } from "@/components/ui/card";
import RichTextRenderer from "@/components/RichTextRenderer";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from 'react-router-dom';
import api from "@/config/axios";
import { Document, Packer, Paragraph } from 'docx';

// Helper to fetch solutions/explanations for exam questions
const fetchSolutionsForQuestions = async (questionIds) => {
  try {
    const res = await api.get('/solutions');
    // Filter only solutions for the given questionIds
    return res.data.filter(s => questionIds.includes(s.questionId));
  } catch {
    return [];
  }
};

// Render exam review HTML with LaTeX rendered using katex.renderToString
const renderExamReviewHTML = (title, questions, solutions) => {
  let html = `<div style=\"font-family:'Times New Roman',Times,serif !important;\"><div style='width:100%;text-align:right;font-weight:bold;font-size:1.1em;color:#222;margin-bottom:8px;'>PhyGen</div><h2 style='text-align:center;color:#2563eb;'>${title || 'Exam Review'}</h2>`;
  const renderLatexBlocks = (inputHtml) => {
    if (!inputHtml) return '';
    // Parse inputHtml, replace all [data-math-inline] nodes with katex.renderToString
    // Use a DOMParser for safety
    try {
      const parser = new window.DOMParser();
      const doc = parser.parseFromString(`<div>${inputHtml}</div>`, 'text/html');
      const nodes = doc.querySelectorAll('[data-math-inline]');
      nodes.forEach(node => {
        const latex = node.getAttribute('value') || '';
        try {
          const rendered = katex.renderToString(latex, {
            throwOnError: false,
            strict: false,
            displayMode: node.tagName === 'DIV',
          });
          node.innerHTML = rendered;
          node.style.background = '#f0f0f0';
          node.style.padding = '4px 6px';
          node.style.borderRadius = '4px';
          node.style.margin = '8px 0';
          node.style.overflowX = 'auto';
          node.style.maxWidth = '100%';
          node.style.wordBreak = 'break-word';
          node.style.display = node.tagName === 'DIV' ? 'block' : 'inline-block';
        } catch (err) {
          node.innerText = latex;
        }
      });
      return doc.body.innerHTML;
    } catch {
      return inputHtml;
    }
  };
  questions.forEach((q, idx) => {
    const solutionObj = solutions.find(s => s.questionId === q.id);
    html += `
      <div style='margin-bottom: 24px;'>
        <div style='font-weight: bold;'>Question ${idx + 1}${q?.difficultyLevel ? ` (${q.difficultyLevel})` : ''}:</div>
        <div>${renderLatexBlocks(q?.content || '<i>No question content</i>')}</div>
        <div style='margin-top: 8px; color: #16a34a; font-weight: bold;'>Solution:</div>
        <div>${renderLatexBlocks(solutionObj?.content || '<i>No solution</i>')}</div>
        <div style='margin-top: 8px; color: #2563eb; font-weight: bold;'>Explanation:</div>
        <div>${renderLatexBlocks(solutionObj?.explanation || '<i>No explanation</i>')}</div>
      </div>
    `;
  });
  html += '</div>';
  return html;
};

const exportExamAsWord = async (title, questions, solutions) => {
  // Chuyển HTML sang plain text cho docx
  const html = renderExamReviewHTML(title, questions, solutions);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const textContent = tempDiv.innerText;
  // Tạo tài liệu docx
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title || 'Exam Review',
            heading: "Heading1"
          }),
          ...textContent.split('\n').map(line => new Paragraph(line))
        ]
      }
    ]
  });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title || 'exam'}.docx`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

const exportExamAsPDF = (title, questions, solutions) => {
  const printWindow = window.open('', '', 'width=900,height=700');
  printWindow.document.write(`
    <html><head><title>${title}</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css"><style>body { font-family: 'Times New Roman', Times, serif !important; }</style></head><body>
    ${renderExamReviewHTML(title, questions, solutions)}
    </body></html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
};

const Card = ({
  id,
  title = "Tên file",
  onClick,
  fileUrl,
  onSoftDeleteSuccess,
  renderTrashMenu,
  questions = [], // Array of question objects {id, content, difficultyLevel}
  type = "exam", // Thêm prop type để phân biệt exam/question
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [solutions, setSolutions] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const reviewRef = useRef();

  const handleCardClick = (e) => {
    if (onClick) onClick(e);
    if (id) {
      if (type === "exam") {
        navigate(`/myexam/${id}`);
      } else if (type === "question") {
        navigate(`/question/${id}`);
      } else {
        navigate(`/card-detail/${id}`);
      }
    } else {
      navigate('/card-detail', {
        state: { title, fileUrl, background: location }
      });
    }
  };

  // Rename exam handler
  const handleRename = async (e) => {
    e.stopPropagation();
    if (!id || type !== 'exam') return;
    const newName = window.prompt('Nhập tên mới cho đề thi:', title);
    if (!newName || newName.trim() === title) return;
    try {
      await api.put(`/exams/rename/${id}?newName=${encodeURIComponent(newName.trim())}`);
      alert('Đổi tên thành công!');
      window.location.reload();
    } catch {
      alert('Có lỗi khi đổi tên!');
    }
  };

  const handleSoftDelete = async (e) => {
    e.stopPropagation();
    if (!id) return;
    if (!window.confirm('Bạn có chắc chắn muốn chuyển vào thùng rác?')) return;
    try {
      await api.put(`/exams/${id}/soft-delete`);
      alert('Đã chuyển vào thùng rác thành công!');
      if (onSoftDeleteSuccess) onSoftDeleteSuccess(id);
    } catch {
      alert('Có lỗi khi chuyển vào thùng rác!');
    }
  };

  // Export handler: fetch solutions/explanations before export
  const handleExport = async (format) => {
    if (!questions || questions.length === 0) {
      alert('Không có câu hỏi để xuất file!');
      return;
    }
    setIsExporting(true);
    try {
      const questionIds = questions.map(q => q.id);
      const sols = await fetchSolutionsForQuestions(questionIds);
      setSolutions(sols);
      if (format === 'pdf') {
        exportExamAsPDF(title, questions, sols);
      } else {
        exportExamAsWord(title, questions, sols);
      }
    } catch (err) {
      alert('Có lỗi khi xuất file!');
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  // Always use white background for card in both light and dark mode for readability
  // Gradient background và icon lớn mờ phía sau tiêu đề
  const cardProps = {
    className: `w-[240px] min-h-[270px] rounded-2xl shadow-md border border-gray-200 flex flex-col justify-between cursor-pointer transition hover:shadow-xl hover:scale-[1.03] bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-[#e0e7ff] dark:via-white dark:to-[#f1f5f9]`,
    style: { position: 'relative', transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s' },
  };
  if (typeof onClick === 'function') {
    cardProps.onClick = handleCardClick;
  }
  return (
    <ShadCard {...cardProps}>
      {/* Icon lớn mờ phía sau tiêu đề */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: 0.13,
      }}>
        <FileText size={110} color="#2563eb" />
      </div>
      <div className="flex items-center justify-between px-4 pt-3 pb-2 relative z-10">
        <CardTitle className="flex-1 text-center text-base font-semibold truncate px-2 text-black">
          {title}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom-right" sideOffset={10} >
            {renderTrashMenu ? (
              renderTrashMenu()
            ) : (
              <>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Download className="w-4 h-4 mr-2" />
                    Tải xuống
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={e => { e.stopPropagation(); handleExport('pdf'); }} disabled={isExporting}>
                      <FileText className="w-4 h-4 mr-2" /> PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={e => { e.stopPropagation(); handleExport('word'); }} disabled={isExporting}>
                      <FileText className="w-4 h-4 mr-2" /> Word
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={handleRename}>
                  <Edit className="w-4 h-4 mr-2" /> Đổi tên
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Chia sẻ')}>
                  <Share2 className="w-4 h-4 mr-2" /> Chia sẻ
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSoftDelete} variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" /> Chuyển vào thùng rác
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="flex flex-col items-center justify-end flex-1 pb-4 pt-0 w-full">
        {/* Ẩn preview nội dung câu hỏi trên card exam, chỉ hiện tiêu đề và icon */}
        {/* KaTeX dark mode fix: force .katex background white and text black in card preview */}
        <style>{`
          .dark .katex { background: #fff !important; color: #111 !important; border-radius: 6px; padding: 2px 6px; }
          .dark .katex .mord, .dark .katex .mop, .dark .katex .mbin, .dark .katex .mrel, .dark .katex .mopen, .dark .katex .mclose, .dark .katex .mpunct, .dark .katex .minner { color: #111 !important; }
        `}</style>
        {/* Hidden review for export (no longer needed, export uses direct HTML render) */}
        {/* <div style={{ display: 'none' }}>
          <div ref={reviewRef}>
            <RichTextRenderer html={renderExamReviewHTML(title, questions, solutions)} />
          </div>
        </div> */}
      </CardContent>
    </ShadCard>
  );
};

export default Card;
