import React, { useState,useRef, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stepper, Step } from '@/components/ui/stepper';
import { Slider } from "@/components/ui/slider";
import clsx from 'clsx';
import semester1 from '@/assets/icons/semester1-logo.jpg';
import semester2 from '@/assets/icons/semester2-logo.jpg';
import avatarIcon from '@/assets/icons/avatar.jpg';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,DropdownMenuRadioItem,DropdownMenuRadioGroup } from '@/components/ui/dropdown-menu';
import api from '@/config/axios';
import { decodeBase64Id } from '@/config/Base64Decode';
import KNTT from '@/assets/icons/KNTT.png';
import CD from '@/assets/icons/CD.png';
import CTST from '@/assets/icons/CTST.png';
import HandPointer from '@/assets/icons/hand-pointer-event-line-svgrepo-com.svg';
import AIIcon from '@/assets/icons/ai-svgrepo-com.svg';
import { Textarea } from '@/components/ui/textarea';
import { Input as ShadInput } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ocrService from '@/config/OCRService';
import OCRResultDisplay from './OCRResultDisplay';
import { AuthContext } from '@/context/AuthContext';
import * as RadixDialog from '@radix-ui/react-dialog';
import TiptapEditor from './TiptapEditor';
import RichTextRenderer from './RichTextRenderer';
import pdfIcon from '@/assets/icons/pdf-icon.svg';
import wordIcon from '@/assets/icons/word-icon.svg';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

const stepsQuestion = [
  { label: 'Grade Level' },
  { label: 'Textbook' },
  { label: 'Semester' },
  { label: 'Chapter' },
  { label: 'Lesson' },
  { label: 'Difficulty level' },
];

const stepsExam = [
  { label: 'Grade Level' },
  { label: 'Semester' },
  { label: 'Type' },
  { label: 'Questions' },
];

// --- MOCK DATA (giữ lại để fallback khi API lỗi/null) ---
const mockGradeLevels = [{value:10,name:'10'},{value:11,name:'11'},{value:12,name:'12'}];
const mockTextbooks = [
  { id: 1, name: 'Kết nối tri thức với cuộc sống', img: KNTT },
  { id: 2, name: 'Cánh diều', img: CD },
  { id: 3, name: 'Chân trời sáng tạo', img: CTST },
];
const mockSemesters = [
  { value: 1, name: '1st Semester', img: semester1 },
  { value: 2, label: '2nd Semester', img: semester2 },
];
const mockChapters = [
  { id: 1, name: 'Chương I : Mở đầu', semesterId: 1 },
  { id: 2, name: 'Chương II. Động học', semesterId: 1 },
  { id: 3, name: 'Chương III. Động lực học', semesterId: 1 },
  { id: 4, name: 'Chương IV. Năng lượng, công, công suất', semesterId: 2 },
  { id: 5, name: 'Chương V. Động lượng', semesterId: 2 },
  { id: 6, name: 'Chương VI. Chuyển động tròn', semesterId: 2 },
  { id: 7, name: 'Chương VII. Biến dạng của vật rắn. Áp', semesterId: 2 },
];
const mockLessons = [
  { id: 1, name: 'Bài 4. Độ dịch chuyển và quãng đường đi được', chapterId: 1 },
  { id: 2, name: 'Bài 5. Tốc độ và vận tốc', chapterId: 1 },
  { id: 3, name: 'Bài 6. Thực hành: Đo tốc độ của vật chuyển động', chapterId: 2 },
  { id: 4, name: 'Bài 7. Đồ thị độ dịch chuyển - thời gian', chapterId: 2 },
  { id: 5, name: 'Bài 8. Chuyển động biến đổi. Gia tốc', chapterId: 3 },
  { id: 6, name: 'Bài 9. Chuyển động thẳng biến đổi đều', chapterId: 3 },
  { id: 7, name: 'Bài 10. Sự rơi tự do', chapterId: 4 },
];
const mockQuestionList = [
  { id: 1, name: 'The Question', avatar: avatarIcon, lessonId: 1 },
  { id: 2, name: 'The Question', avatar: avatarIcon, lessonId: 1 },
];
// --- END MOCK DATA ---

const difficultyLevels = ['Easy','Medium','Hard'];

const examTypes = [
  { id: 1, name: 'One-Period Exam' },
  { id: 2, name: 'Semester Exam' },
];

const questionCreateTypes = [
  { id: 'manual', label: 'Tạo thủ công', icon: HandPointer },
  { id: 'ai', label: 'Nhận diện từ ảnh', icon: AIIcon },
];

const MultiStepWizard = ({ onComplete, type, onBack }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  // --- State động ---
  const [gradeLevels, setGradeLevels] = useState(mockGradeLevels);
  const [semesters, setSemesters] = useState(mockSemesters);
  const [chapters, setChapters] = useState(mockChapters);
  const [lessons, setLessons] = useState(mockLessons);
  const [textbooks, setTextbooks] = useState(mockTextbooks);
  const [textbook, setTextbook] = useState(null); // id
  // --- State lựa chọn ---
  const [step, setStep] = useState(0);
  const [grade, setGrade] = useState(null); // sẽ là id hoặc encodedId
  const [semester, setSemester] = useState(null); // sẽ là id
  const [chapter, setChapter] = useState(null); // sẽ là id
  const [lesson, setLesson] = useState(null); // sẽ là id
  const [difficulty, setDifficulty] = useState(0); // 0-4 corresponding to difficultyLevels
  const [questionType, setQuestionType] = useState(null);
  const [manualQuestion, setManualQuestion] = useState('');
  const [manualSolution, setManualSolution] = useState('');
  const [manualQuestionSource, setManualQuestionSource] = useState('');
  const [manualExplanation, setManualExplanation] = useState('');
  const physicsSymbols = [
    { symbol: 'Δ', label: 'Delta' },
    { symbol: 'λ', label: 'Lambda' },
    { symbol: 'θ', label: 'Theta' },
    { symbol: 'μ', label: 'Mu' },
    { symbol: 'Ω', label: 'Ohm' },
    { symbol: 'π', label: 'Pi' },
    { symbol: '∑', label: 'Sum' },
    { symbol: '√', label: 'Sqrt' },
    { symbol: '∫', label: 'Integral' },
    { symbol: '∞', label: 'Infinity' },
  ];

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean'],
    ]
  };
  const [aiImage, setAiImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrError, setOcrError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ocrLanguage, setOcrLanguage] = useState('eng+vie');

  // State cho flow exam
  const [examType, setExamType] = useState(null);
  const [selectedExamQuestions, setSelectedExamQuestions] = useState([]);
  // Lưu chi tiết các câu hỏi đã chọn (object)
  const [selectedExamQuestionsDetails, setSelectedExamQuestionsDetails] = useState([]);
  const [filterExamTextbook, setFilterExamTextbook] = useState(null);
  const [filterExamChapter, setFilterExamChapter] = useState(null);
  const [filterExamLesson, setFilterExamLesson] = useState(null);
  const [filterExamDifficulty, setFilterExamDifficulty] = useState(null);
  const [examQuestionsList, setExamQuestionsList] = useState([]);
  const [examReviewSolutions, setExamReviewSolutions] = useState({}); // { [questionId]: {solution, explanation} }
  const [solutions, setSolutions] = useState([]);
  const [openIndexes, setOpenIndexes] = useState([]); // State cho accordion
  const [examName, setExamName] = useState(''); // State cho tên bài kiểm tra
  const [showExamNameInput, setShowExamNameInput] = useState(false); // State hiển thị input
  // Thêm state exportFormat (word/pdf)
  const [exportFormat, setExportFormat] = useState('word'); // 'word' hoặc 'pdf'

  // Thêm ref cho review content
  const reviewRef = useRef();

  // State điều khiển modal/section in PDF
  const [showPrintReview, setShowPrintReview] = useState(false);

  // Hàm render nội dung review exam thành HTML
  const renderExamReviewHTML = () => {
    let html = `<div><h2 style="text-align:center; color:#2563eb;">${examName || 'Exam Review'}</h2>`;
    selectedExamQuestions.forEach((qid, idx) => {
      const q = examQuestionsList.find(q => q.id === qid);
      const solutionObj = solutions.find(s => s.questionId === qid);
      html += `
        <div style="margin-bottom: 24px;">
          <div style="font-weight: bold;">Question ${idx + 1}${q?.difficultyLevel ? ` (${q.difficultyLevel})` : ''}:</div>
          <div>${q?.content || ''}</div>
          <div style="margin-top: 8px; color: #16a34a; font-weight: bold;">Solution:</div>
          <div>${solutionObj?.content || '<i>No solution</i>'}</div>
          <div style="margin-top: 8px; color: #2563eb; font-weight: bold;">Explanation:</div>
          <div>${solutionObj?.explanation || '<i>No explanation</i>'}</div>
        </div>
      `;
    });
    html += '</div>';
    return html;
  };

  // Hàm xử lý download file review (PDF/Word)
  const handleDownloadExamReview = async (e) => {
    e.preventDefault();
    if (exportFormat === 'pdf') {
      setShowPrintReview(true);
      setTimeout(() => {
        window.print();
        setShowPrintReview(false);
      }, 200);
    } else if (exportFormat === 'word') {
      // Word: lấy innerHTML của reviewRef, tạo Blob, tải về .doc
      if (reviewRef.current) {
        const html = `<!DOCTYPE html><html><head><meta charset='utf-8'></head><body>${reviewRef.current.innerHTML}</body></html>`;
        const blob = new Blob([html], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${examName || 'exam-review'}.doc`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      }
    }
  };

  // --- State riêng cho modal Search Question ---
  const [modalChapters, setModalChapters] = useState([]);
  const [modalLessons, setModalLessons] = useState([]);


  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [examFormat, setExamFormat] = useState('word');
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  // Khi chọn filterExamChapter, gọi API lấy lessons cho modal
  useEffect(() => {
    if (!filterExamChapter) {
      setModalLessons([]);
      setFilterExamLesson(null);
      return;
    }
    (async () => {
      try {
        const res = await api.get(`/lessons?chapterId=${filterExamChapter}`);
        if (res.data && Array.isArray(res.data.items)) {
          setModalLessons(res.data.items);
        } else {
          setModalLessons([]);
        }
      } catch (error) {
        setModalLessons([]);
      }
    })();
    setFilterExamLesson(null);
  }, [filterExamChapter]);

  // Khi chọn semester, gọi API lấy chapters cho modal
  useEffect(() => {
    if (!semester) {
      setModalChapters([]);
      setFilterExamChapter(null);
      setModalLessons([]);
      setFilterExamLesson(null);
      return;
    }
    (async () => {
      try {
        const res = await api.get('/chapters');
        let filtered = res.data.filter(c => c.semesterId === semester);
        setModalChapters(filtered);
      } catch (error) {
        setModalChapters([]);
      }
    })();
    setFilterExamChapter(null);
    setModalLessons([]);
    setFilterExamLesson(null);
  }, [semester]);

  const handleApplyToField = (fieldType, text) => {
    if (fieldType === 'question') {
      setManualQuestion(text);
    } else if (fieldType === 'solution') {
      setManualSolution(text);
    }
  };

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setAiImage(file);
    }
  }
  function handleDragOver(e) {
    e.preventDefault();
    setDragActive(true);
  }
  function handleDragLeave(e) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAiImage(file);
      handleImage(file, ocrLanguage);
    }
  }

  const handleImage = async (file, language = ocrLanguage) => {
    try {
      setIsProcessingOCR(true);
      setOcrError(null);
      setOcrResult(null);
      
      console.log('🖼️ Starting OCR processing for file:', file.name);
      
      // Sử dụng advanced OCR processing
      const result = await ocrService.processImageAdvanced(file, language);
      
      if (result.success) {
        console.log('✅ OCR completed successfully:', result);
        setOcrResult(result);
        
        // Phân tích nội dung
        const analysis = ocrService.analyzeContent(result.text);
        console.log('📊 Content analysis:', analysis);
        
        // Tự động điền vào các trường nếu có thể
        if (analysis.isMath) {
          // Nếu là công thức toán học, điền vào solution
          setManualSolution(result.text);
        } else {
          // Nếu là text thường, điền vào question
          setManualQuestion(result.text);
        }
        
        // setTextResult(result.text); // Xóa textResult
      } else {
        console.error('❌ OCR failed:', result.error);
        setOcrError(result.error);
      }
    } catch (error) {
      console.error('❌ Error during OCR processing:', error);
      setOcrError(error.message);
    } finally {
      setIsProcessingOCR(false);
    }
  };
  
  function handleRemove() {
    setAiImage(null);
    if (inputRef.current) inputRef.current.value = '';
    // setTextResult(''); // Xóa textResult
    setOcrResult(null);
    setOcrError(null);
  }

  // XÓA hàm handleSelectQuestion không dùng
  // const handleSelectQuestion = (id) => {
  //   setSelectedQuestions((prev) =>
  //     prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
  //   );
  // };
  
  React.useEffect(()=>{
    console.log("Cái question sao không lưu được",manualQuestion);
  },[manualQuestion])

  // Cleanup OCR service when component unmounts
  React.useEffect(() => {
    return () => {
      ocrService.terminate();
    };
  }, []);

  // --- API: Lấy gradeLevels khi mount ---
  React.useEffect(() => {
    (async () => {
      try {
        console.log('🔍 Fetching grade levels...');
        const res = await api.get('/grades');
        console.log('📊 Grade levels API response:', res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mappedGrades = res.data.map(g => {
            // Giải mã encodedId thành id thực tế
            const decodedId = decodeBase64Id(g.encodedId);
            console.log("🔓 Decoded ID for grade:", g.name, "Original:", g.encodedId, "Decoded:", decodedId);
            return { 
              ...g, 
              label: g.name, 
              value: decodedId || g.id, // Sử dụng decodedId nếu có, fallback về g.id
              originalId: decodedId || g.id // Lưu id thực tế để sử dụng sau này
            };
          });
          console.log('✅ Mapped grade levels:', mappedGrades);
          setGradeLevels(mappedGrades);
        } else {
          console.log('⚠️ No grade levels found, using mock data');
          setGradeLevels(mockGradeLevels);
        }
      } catch (error) {
        console.error('❌ Error fetching grade levels:', error);
        setGradeLevels(mockGradeLevels);
      }
    })();
  }, []);

  // --- API: Lấy textbooks khi chọn grade ---
  React.useEffect(() => {
    if (!grade) return;
    (async () => {
      try {
        console.log('🔍 Fetching textbooks for grade:', grade);
        const res = await api.get('/text-books');
        console.log('📚 All textbooks from API:', res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const filteredTextbooks = res.data.filter(tb => tb.gradeId === grade);
          console.log('✅ Filtered textbooks for grade', grade, ':', filteredTextbooks);
          setTextbooks(filteredTextbooks);
        } else {
          console.log('⚠️ No textbooks found, using mock data');
          setTextbooks(mockTextbooks);
        }
      } catch (error) {
        console.error('❌ Error fetching textbooks:', error);
        setTextbooks(mockTextbooks);
      }
    })();
    setTextbook(null);
  }, [grade]);

  // --- API: Lấy semesters khi chọn grade ---
  React.useEffect(() => {
    if (!grade) return;
    (async () => {
      try {
        console.log('🔍 Fetching semesters for grade:', grade);
        const res = await api.get(`/semesters/by-grade/${grade}`);
        console.log('📅 Semesters API response:', res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mappedSemesters = res.data.map(s => ({ ...s, value: s.id, label: s.name, img: s.value === 1 ? semester1 : semester2 }));
          console.log('✅ Mapped semesters:', mappedSemesters);
          setSemesters(mappedSemesters);
        } else {
          console.log('⚠️ No semesters found, using mock data');
          setSemesters(mockSemesters);
        }
      } catch (error) {
        console.error('❌ Error fetching semesters:', error);
        setSemesters(mockSemesters);
      }
    })();
    // Reset các bước sau
    setSemester(null); setChapter(null); setLesson(null); setChapters([]); setLessons([]); setExamQuestionsList([]);
  }, [grade]);

  // --- API: Lấy chapters khi chọn semester ---
  React.useEffect(() => {
    if (!semester) return;
    (async () => {
      try {
        console.log('🔍 Fetching chapters for semester:', semester);
        const res = await api.get('/chapters');
        console.log('📖 All chapters from API:', res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const filteredChapters = res.data.filter(c => c.semesterId === semester);
          console.log('✅ Filtered chapters for semester', semester, ':', filteredChapters);
          setChapters(filteredChapters);
        } else {
          console.log('⚠️ No chapters found, using mock data');
          setChapters(mockChapters.filter(c => c.semesterId === semester));
        }
      } catch (error) {
        console.error('❌ Error fetching chapters:', error);
        setChapters(mockChapters.filter(c => c.semesterId === semester));
      }
    })();
    setChapter(null); setLesson(null); setLessons([]);
  }, [semester]);

  // --- API: Lấy lessons khi chọn chapter ---
  React.useEffect(() => {
    if (!chapter) return;
    (async () => {
      try {
        console.log('🔍 Fetching lessons for chapter:', chapter);
        const res = await api.get(`/lessons?chapterId=${chapter}`);
        console.log('📚 Lessons API response:', res.data);
        if (res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
          console.log('✅ Lessons found:', res.data.items);
          setLessons(res.data.items);
        } else {
          console.log('⚠️ No lessons found, using mock data');
          setLessons(mockLessons.filter(l => l.chapterId === chapter));
        }
      } catch (error) {
        console.error('❌ Error fetching lessons:', error);
        setLessons(mockLessons.filter(l => l.chapterId === chapter));
      }
    })();
    setExamQuestionsList([]);
  }, [chapter]);

  // --- API: Lấy questionList khi chọn lesson ---
  React.useEffect(() => {
    if (!lesson) return;
    (async () => {
      try {
        console.log('🔍 Fetching questions for lesson:', lesson);
        const res = await api.get(`/questions?lessonId=${lesson}`);
        console.log('❓ Questions API response:', res.data);
        if (res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
          console.log('✅ Questions found:', res.data.items);
          setExamQuestionsList(res.data.items);
        } else {
          console.log('⚠️ No questions found, using mock data');
          setExamQuestionsList(mockQuestionList.filter(q => q.lessonId === lesson));
        }
      } catch (error) {
        console.error('❌ Error fetching questions:', error);
        setExamQuestionsList(mockQuestionList.filter(q => q.lessonId === lesson));
      }
    })();
  }, [lesson]);

  // Hàm gửi question và solution
  const handleCreateQuestionAndSolution = async () => {
    console.log("Lesson để nộp",lesson);
    try {
      // Chuẩn bị dữ liệu question
      const questionPayload = {
        content: manualQuestion,
        questionSource: manualQuestionSource,
        difficultyLevel: difficultyLevels[difficulty],
        lessonId: lesson,
        createdByUserId: user?.id,
      };
      console.log('POST /api/questions payload:', questionPayload);
      const questionRes = await api.post('/questions', questionPayload);
      console.log('POST /api/questions response:', questionRes.data);
      const questionId = questionRes.data?.question?.id;
      if (!questionId) throw new Error('Không lấy được questionId từ response');

      // Chuẩn bị dữ liệu solution
      const solutionPayload = {
        questionId,
        content: manualSolution,
        explanation: manualExplanation,
        createdByUserId: user?.id,
      };
      console.log('POST /api/solutions payload:', solutionPayload);
      const solutionRes = await api.post('/solutions', solutionPayload);
      console.log('POST /api/solutions response:', solutionRes.data);
      return { question: questionRes.data, solution: solutionRes.data };
    } catch (error) {
      console.error('Error in handleCreateQuestionAndSolution:', error);
      throw error;
    }
  };

  // Thêm hàm fetchSearchQuestionDialog
  const fetchSearchQuestionDialog = async () => {
    const params = {};
    if (filterExamLesson) params.lessonId = filterExamLesson;
    if (filterExamChapter) params.chapterId = filterExamChapter;
    if (filterExamDifficulty !== null && filterExamDifficulty.length > 0) {
      params.difficultyLevel = filterExamDifficulty.map(idx => difficultyLevels[idx]).join(',');
    }
    // Nếu có input search, thêm: params.search = searchValue;
    try {
      const res = await api.get('/questions', { params });
      setExamQuestionsList(res.data.items || []);
    } catch (error) {
      setExamQuestionsList([]);
    }
  };

    // Gọi API lấy solutions khi vào step 4
    useEffect(() => {
      if (step === 4) {
        api.get('/solutions')
          .then(res => setSolutions(res.data))
          .catch(() => setSolutions([]));
      }
    }, [step]);

  const toggleOpen = (idx) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  // Hàm tạo exam và gán câu hỏi vào exam
  const handleCreateExam = async () => {
    setLesson(1);
    if (!examName || !examType || !user?.id || selectedExamQuestions.length === 0) {
      console.log("Exam name",examName);
      console.log("Exam name",examType);
      console.log("Exam name",user?.id);
      console.log("Độ dài bài kiểm tra có bằng 0 hay không",selectedExamQuestions.length === 0);
      throw new Error('Thiếu thông tin để tạo bài kiểm tra');
    }
    
    // Lấy id examType
    const examTypeObj = examTypes.find(e => e.id === examType);
    if (!examTypeObj) throw new Error('Không tìm thấy examType');
    
    try {
      // 1. Tạo exam
      const examPayload = {
        name: examName,
        lessonId: 1,
        examTypeId: examTypeObj.id,
        createdByUserId: user.id,
      };
      
      console.log('📝 Creating exam with payload:', examPayload);
      const examRes = await api.post('/exams', examPayload);
      console.log("Đã tạo được vỏ exam",examRes);
      const examId = examRes.data?.id || examRes.data?.examId || examRes.data?.exam?.id;
      if (!examId) throw new Error('Không lấy được examId từ response');
      // 2. Gán câu hỏi vào exam
      const assignResults = [];
      for (let i = 0; i < selectedExamQuestions.length; i++) {
        const questionId = selectedExamQuestions[i];
        const assignPayload = {
          examId,
          questionId,
          order: i + 1,
        };
        console.log("Những câu hỏi sẽ vào kiểm tra",assignPayload);
        const assignRes = await api.post('/exams/questions', assignPayload);
        assignResults.push(assignRes.data);
      }
      
      console.log('✅ All questions assigned successfully');
      return { exam: examRes.data, assignedQuestions: assignResults };
    } catch (error) {
      console.error('Error in handleCreateExam:', error);
      throw error;
    }
  };

  // Render step content
  let content = null;
  if (type === 'exam') {
    // Step 0: Grade Level
  if (step === 0) {
      content = (
        <>
          <div className="text-2xl font-semibold text-center mb-6">{t('select_grade_level_for_exam')}</div>
          <div className="flex gap-8 justify-center mb-8">
            {gradeLevels.map((g) => (
              <Card
                key={g.value}
                className={clsx(
                  'w-48 h-64 flex items-center justify-center cursor-pointer border-2 transition',
                  grade === g.value ? 'border-blue-500 shadow-lg' : 'border-slate-200 hover:border-blue-300'
                )}
                onClick={() => setGrade(g.value)}
              >
                <CardContent className="flex items-center justify-center h-full">
                  <span className="text-6xl font-bold">{g.label || g.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between">
            <Button onClick={onBack} className="bg-blue-500 hover:bg-blue-600">Back</Button>
            <Button onClick={() => setStep(1)} disabled={!grade} className="bg-blue-500 hover:bg-blue-600">Next</Button>
          </div>
        </>
      );
    }
    // Step 1: Semester
    else if (step === 1) {
      content = (
        <>
          <div className="text-2xl font-semibold text-center mb-6">{t('select_semester_for_exam')}</div>
          <div className="flex gap-8 justify-center mb-8">
            {semesters.map((s) => (
              <Card
                key={s.value}
                className={clsx(
                  'w-64 h-64 flex items-center justify-center cursor-pointer border-2 transition',
                  semester === s.value ? 'border-blue-500 shadow-lg' : 'border-slate-200 hover:border-blue-300'
                )}
                onClick={() => setSemester(s.value)}
              >
                <CardContent className="flex items-center justify-center h-full">
                  <span className="text-xl font-bold text-center leading-tight">{s.name || s.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between">
            <Button onClick={() => setStep(0)} className="bg-blue-500 hover:bg-blue-600">Back</Button>
            <Button onClick={() => setStep(2)} disabled={!semester} className="bg-blue-500 hover:bg-blue-600">Next</Button>
          </div>
        </>
      );
    }
    // Step 2: Type
    else if (step === 2) {
      content = (
        <>
          <div className="text-2xl font-semibold text-center mb-6">{t('select_exam_type')}</div>
          <div className="flex gap-8 justify-center mb-8">
            {examTypes.map((et) => (
              <Card
                key={et.id}
                className={clsx(
                  'w-64 h-64 flex flex-col items-center justify-center cursor-pointer border-2 transition',
                  examType === et.id ? 'border-blue-500 shadow-lg' : 'border-slate-200 hover:border-blue-300',
                  'rounded-xl'
                )}
                onClick={() => setExamType(et.id)}
              >
                <CardContent className="flex flex-col items-center justify-center h-full w-full">
                  <span className="text-xl font-bold text-center leading-tight">{et.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between">
            <Button onClick={() => setStep(1)} className="bg-blue-500 hover:bg-blue-600">Back</Button>
            <Button onClick={() => setStep(3)} disabled={!examType} className="bg-blue-500 hover:bg-blue-600">Next</Button>
          </div>
        </>
      );
    }
    // Step 3: Questions (bộ lọc và chọn câu hỏi)
    else if (step === 3) {
      content = (
        <>
          <div className="text-2xl font-semibold text-center mb-6">{t('select_questions_for_exam')}</div>
          <div className="mb-4 flex justify-center">
            <Button onClick={() => setSearchModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">Search Question</Button>
          </div>
          <div className="mb-4">
            <Label>{t('selected_question_list')}</Label>
            <div className="max-h-64 overflow-y-auto border rounded p-2 bg-slate-50">
              {selectedExamQuestions.length === 0 && <div className="text-gray-400 italic">{t('no_selected_questions')}</div>}
              {selectedExamQuestionsDetails.map(question => (
                <div key={question.id} className="flex items-center gap-2 border-b py-2 last:border-b-0">
                  <span><RichTextRenderer html={question?.content} /></span>
                  <Button size="sm" variant="outline" className="bg-red-600 text-white  hover:bg-red-700 hover:text-white" onClick={() => {
                    setSelectedExamQuestions(prev => prev.filter(id => id !== question.id));
                    setSelectedExamQuestionsDetails(prev => prev.filter(q => q.id !== question.id));
                  }}>Remove</Button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <Button onClick={() => setStep(2)} className="bg-blue-500 hover:bg-blue-600">Back</Button>
            <Button onClick={() => setStep(4)} disabled={selectedExamQuestions.length === 0} className="bg-blue-500 hover:bg-blue-600">Next</Button>
          </div>

          {/* Modal Search Question */}
          <RadixDialog.Root open={searchModalOpen} onOpenChange={setSearchModalOpen}>
  <RadixDialog.Portal>
    <RadixDialog.Overlay className="fixed inset-0 bg-black/30 z-[9998]" />
    <RadixDialog.Content className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white shadow-lg p-6 rounded-xl relative focus:outline-none">
        <RadixDialog.Title className="text-xl font-bold mb-4">{t('search_questions')}</RadixDialog.Title>

        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          onClick={() => setSearchModalOpen(false)}
          aria-label="Close"
          type="button"
        >
          ×
        </button>

        <div className="mb-4 flex flex-col gap-4">
          <div>
            <Label>Textbook</Label>
            <select className="border rounded p-2 w-full" value={filterExamTextbook || ''} onChange={e => setFilterExamTextbook(e.target.value)}>
              <option value="">All</option>
              {textbooks.map(tb => <option key={tb.id} value={tb.id}>{tb.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Chapter</Label>
            <select className="border rounded p-2 w-full" value={filterExamChapter || ''} onChange={e => setFilterExamChapter(e.target.value)}>
              <option value="">All</option>
              {modalChapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Lesson</Label>
            <select className="border rounded p-2 w-full" value={filterExamLesson || ''} onChange={e => setFilterExamLesson(e.target.value)}>
              <option value="">All</option>
              {modalLessons.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Difficulty</Label>
            <div className="flex gap-4 mt-2">
              {difficultyLevels.map((d, idx) => (
                <label key={d} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="difficulty-radio"
                    checked={Array.isArray(filterExamDifficulty) && filterExamDifficulty[0] === idx}
                    onChange={e => {
                      if (e.target.checked) {
                        setFilterExamDifficulty([idx]);
                      }
                    }}
                  />
                  <span>{d}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Button onClick={fetchSearchQuestionDialog}>{t('search')}</Button>
        </div>

        <div className="mb-4">
          <Label>Danh sách câu hỏi:</Label>
          <div className="max-h-64 overflow-y-auto border rounded p-2 bg-slate-50">
            {examQuestionsList.length === 0 && <div className="text-gray-400 italic">{t('no_questions_found')}</div>}
            {examQuestionsList.map(q => (
              <div key={q.id} className="flex items-center gap-2 border-b py-2 last:border-b-0">
                <input
                  type="checkbox"
                  checked={selectedExamQuestions.includes(q.id)}
                  onChange={async e => {
                    if (e.target.checked) {
                      setSelectedExamQuestions(prev => [...prev, q.id]);
                      setSelectedExamQuestionsDetails(prev => {
                        // Nếu đã có thì không thêm lại
                        if (prev.some(qq => qq.id === q.id)) return prev;
                        return [...prev, q];
                      });
                    } else {
                      setSelectedExamQuestions(prev => prev.filter(id => id !== q.id));
                      setSelectedExamQuestionsDetails(prev => prev.filter(qq => qq.id !== q.id));
                    }
                  }}
                />
                <span><RichTextRenderer html={q.content} /></span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setSearchModalOpen(false)}>{t('close')}</Button>
          <Button onClick={() => setSearchModalOpen(false)} className="bg-blue-500 hover:bg-blue-600">{t('confirm')}</Button>
        </div>
      </div>
    </RadixDialog.Content>
  </RadixDialog.Portal>
</RadixDialog.Root>

        </>
      );
    }
    // Step 4: Review
    else if (step === 4) {
      // Phân trang câu hỏi
      const totalQuestions = selectedExamQuestions.length;
      const totalPages = Math.ceil(totalQuestions / questionsPerPage);
      const startIdx = (currentPage - 1) * questionsPerPage;
      const endIdx = startIdx + questionsPerPage;
      const paginatedQuestions = selectedExamQuestions.slice(startIdx, endIdx);
      content = (
        <>
          <div className="text-2xl font-semibold text-center mb-6 ">
            {examName ? (
              <span>{examName}</span>
            ) : (
              <span className="italic text-gray-400">(Chưa đặt tên bài kiểm tra)</span>
            )}
          </div>
          <div className="max-w-2xl mx-auto bg-slate-50 rounded-lg p-6 border mb-8 ">
             {selectedExamQuestions.length > 0 && (
               <div className="flex justify-between mb-4">
                 <Button size="sm" variant="outline" onClick={() => setOpenIndexes([])}>
                   Đóng tất cả
                 </Button>
                 <Button size="sm" variant="outline" onClick={() => setShowExamNameInput(true)}>
                   {t('enter_exam_name')}
                 </Button>
               </div>
             )}
             {/* Input đặt tên bài kiểm tra */}
             {showExamNameInput && (
               <div className="flex items-center gap-2 mb-4">
                 <input
                   type="text"
                   className="border rounded px-2 py-1 flex-1"
                   placeholder={t('exam_name_placeholder')}
                   value={examName}
                   onChange={e => setExamName(e.target.value)}
                   autoFocus
                 />
                 <Button size="sm" onClick={() => setShowExamNameInput(false)}>
                   {t('save')}
                 </Button>
                 <Button size="sm" variant="outline" onClick={() => setShowExamNameInput(false)}>
                   {t('cancel')}
                 </Button>
               </div>
             )}
            {selectedExamQuestions.length === 0 && <div className="text-gray-400 italic">Chưa chọn câu hỏi nào</div>}
            {paginatedQuestions.map((qid, idx) => {
              const q = selectedExamQuestionsDetails.find(q => q.id === qid);
              const solutionObj = solutions.find(s => s.questionId === qid);
              const globalIdx = startIdx + idx;
              const isOpen = openIndexes.includes(globalIdx);
              return (
                <div key={qid} className="mb-2 border-b pb-2 last:border-b-0">
                  <div
                    className="flex items-center cursor-pointer select-none"
                    onClick={() => toggleOpen(globalIdx)}
                  >
                    <div className="font-bold mr-2">{t('question')} {globalIdx + 1} {q?.difficultyLevel}</div>
                    <span className="text-blue-500">{isOpen ? "▲" : "▼"}</span>
                    <span className="ml-2"><RichTextRenderer html={q?.content} /></span>
                  </div>
                  {isOpen && (
                    <div className="pl-4 mt-2">
                      <div className="bg-green-50 p-3 rounded mb-2">
                        <div className="font-semibold">Solution:</div>
                        <div>{solutionObj?.content ? <RichTextRenderer html={solutionObj.content} /> : <span className="italic text-gray-400">{t('no_solution')}</span>}</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="font-semibold">Explanation:</div>
                        <div>{solutionObj?.explanation ? <RichTextRenderer html={solutionObj.explanation} /> : <span className="italic text-gray-400">{t('no_explanation')}</span>}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 my-4">
                <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
              </div>
            )}
          </div>
          <div className="flex justify-between mt-8">
            <Button onClick={() => setStep(3)} className="bg-blue-500 hover:bg-blue-600">Back</Button>
            <Button
              onClick={() => setShowConfirmModal(true)}
              className="bg-green-500 hover:bg-green-600"
              disabled={!examName}
            >
              {t('confirm_create_exam')}
            </Button>
          </div>
          {/* Modal xác nhận gửi sử dụng ConfirmDialog */}
          <ConfirmDialog
            open={showConfirmModal}
            onOpenChange={setShowConfirmModal}
            onConfirm={async () => {
              setIsSubmitting(true);
              try {
                const result = await handleCreateExam();
                console.log('✅ Kết quả tạo exam:', result);
                setShowConfirmModal(false);
                setStep(5);
              } catch (e) {
                console.error('❌ Lỗi khi tạo exam:', e);
                alert(`❌ Lỗi khi tạo bài kiểm tra: ${e.message}`);
              } finally {
                setIsSubmitting(false);
              }
            }}
            onCancel={() => setShowConfirmModal(false)}
            isSubmitting={isSubmitting}
            title="Confirm Submission"
            message="Are you sure you want to submit this information?"
            note="Once sent, it may not be editable."
            confirmText="Confirm"
            cancelText="Back"
          />
        </>
      );
    }
    // Step 5: Thank you (cảm ơn)
    else if (step === 5) {
      content = (
        <div className="flex flex-col items-center justify-center min-h-[420px]">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-green-100 p-6 mb-4">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="38" stroke="#4ade80" strokeWidth="4" fill="#f0fdf4" />
                <polyline points="25,43 37,55 57,30" fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Thank you!</h2>
            <p className="text-gray-600 mb-6">Your submission has been sent.</p>
            {/* Chọn định dạng xuất file */}
            <div className="flex items-center gap-4 mb-4">
              <span className="font-semibold">Export as:</span>
              <label className="flex items-center gap-1">
              <img src={wordIcon} alt="PDF" className="w-5 h-5 mr-2 inline-block" />
                <input type="radio" name="exportFormat" value="word" checked={exportFormat === 'word'} onChange={() => setExportFormat('word')} /> Word
              </label>
              <label className="flex items-center gap-1">
              <img src={pdfIcon} alt="PDF" className="w-5 h-5 mr-2 inline-block" />
                <input type="radio" name="exportFormat" value="pdf" checked={exportFormat === 'pdf'} onChange={() => setExportFormat('pdf')} /> PDF
              </label>
              <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleDownloadExamReview}>
                {exportFormat === 'pdf' ? 'Print PDF' : 'Download here'}
              </button>
            </div>
            {/* Hidden review content for export (giữ nguyên công thức toán học) */}
            <div style={{ display: 'none' }}>
              <div ref={reviewRef}>
                <RichTextRenderer html={renderExamReviewHTML()} />
              </div>
            </div>
            {/* Section/modal in PDF (chỉ hiện khi showPrintReview) */}
            {showPrintReview && (
              <div id="print-review-section" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'white', zIndex: 9999, overflow: 'auto', padding: 32 }}>
                <RichTextRenderer html={renderExamReviewHTML()} />
              </div>
            )}
            <div className="flex gap-4">
              <Button onClick={() => window.location.href = '/'} className="bg-blue-500 hover:bg-blue-600">Go Home</Button>
              <Button onClick={() => {
                // Reset wizard về bước đầu và các state liên quan
                setGrade(null);
                setSemester(null);
                setChapter(null);
                setLesson(null);
                setDifficulty(0);
                setExamType(null);
                setSelectedExamQuestions([]);
                setExamName('');
                setShowExamNameInput(false);
                setStep(0);
                if (typeof onComplete === 'function') onComplete();
              }} className="bg-green-500 hover:bg-green-600">Continue Create</Button>
            </div>
          </div>
        </div>
      );
    }
  } else {
    // Toàn bộ flow question (tất cả các bước step === 0, 1, 2, ...)
    if (step === 0) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">{t('select_grade_level_for_your', { type })}</div>
        <div className="flex gap-8 justify-center mb-8">
          {gradeLevels.map((g) => (
            <Card
              key={g.value}
              className={clsx(
                'w-48 h-64 flex items-center justify-center cursor-pointer border-2 transition',
                grade === g.value ? 'border-blue-500 shadow-lg' : 'border-slate-200 hover:border-blue-300'
              )}
              onClick={() => {
                setGrade(g.value);
                console.log("🎯 Grade selected:", g.value, "Label:", g.label);
              }}
            >
              <CardContent className="flex items-center justify-center h-full">
                <span className="text-6xl font-bold">{g.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={onBack} className="bg-blue-500 hover:bg-blue-600">{t('back')}</Button>
          <Button onClick={() => setStep(1)} disabled={!grade} className="bg-blue-500 hover:bg-blue-600">{t('accept')}</Button>
        </div>
      </>
    );
  } else if (step === 1) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">{t('select_textbook_for_your', { type })}</div>
        <div className="flex gap-8 justify-center mb-8">
          {textbooks.map((tb) => (
            <Card
              key={tb.id}
              className={clsx(
                'w-64 h-64 flex flex-col items-center justify-center cursor-pointer border-2 transition',
                textbook === tb.id ? 'border-blue-500 shadow-lg' : 'border-slate-200 hover:border-blue-300',
                'rounded-xl'
              )}
              onClick={() => setTextbook(tb.id)}
            >
              <CardContent className="flex flex-col items-center justify-center h-full w-full">
                {/* <img src={tb.img} alt={tb.name} className="w-40 h-40 object-contain mb-4" /> */}
                <span className="text-xl font-bold text-center leading-tight">{tb.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setStep(0)} className="bg-blue-500 hover:bg-blue-600">{t('back')}</Button>
          <Button onClick={() => setStep(2)} disabled={!textbook} className="bg-blue-500 hover:bg-blue-600">{t('accept')}</Button>
        </div>
      </>
    );
  } else if (step === 2) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">{t('select_semester_for_your', { type })}</div>
        <div className="flex gap-8 justify-center mb-8">
          {semesters.map((s) => (
            <Card
              key={s.value}
              className={clsx(
                'w-64 h-64 flex items-center justify-center cursor-pointer border-2 transition',
                semester === s.value ? 'border-blue-500 shadow-lg' : 'border-slate-200 hover:border-blue-300'
              )}
              onClick={() => setSemester(s.value)}
            >
              <CardContent className="flex items-center justify-center h-full">
                {/* <img src={s.img} alt={s.label} className="w-40 h-40 object-contain" /> */}
                <span className="text-xl font-bold text-center leading-tight">{s.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setStep(1)} className="bg-blue-500 hover:bg-blue-600">{t('back')}</Button>
          <Button onClick={() => setStep(3)} disabled={!semester} className="bg-blue-500 hover:bg-blue-600">{t('accept')}</Button>
        </div>
      </>
    );
  } else if (step === 3) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">{t('select_chapter_for_your', { type })}</div>
        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto mb-8">
          {chapters.map((c) => (
            <Card
              key={c.id}
              className={clsx(
                'p-4 border-2 rounded-lg cursor-pointer transition',
                chapter === c.id ? 'bg-blue-600 text-white' : 'border-slate-200 hover:border-blue-300'
              )}
              onClick={() => setChapter(c.id)}
            >
              <CardContent className="p-2">
                <span className="text-sm font-medium">{c.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setStep(2)} className="bg-blue-500 hover:bg-blue-600">{t('back')}</Button>
          <Button onClick={() => setStep(4)} disabled={!chapter} className="bg-blue-500 hover:bg-blue-600">{t('accept')}</Button>
        </div>
      </>
    );
  } else if (step === 4) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">{t('select_lesson_for_your', { type })}</div>
        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto mb-8">
          {lessons.map((l) => (
            <Card
              key={l.id}
              className={clsx(
                'p-4 border-2 rounded-lg cursor-pointer transition',
                lesson === l.id ? 'bg-blue-600 text-white' : 'border-slate-200 hover:border-blue-300'
              )}
              onClick={() => setLesson(l.id)}
            >
              <CardContent className="p-2">
                <span className="text-sm font-medium">{l.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setStep(3)} className="bg-blue-500 hover:bg-blue-600">{t('back')}</Button>
          <Button onClick={() => setStep(5)} disabled={!lesson} className="bg-blue-500 hover:bg-blue-600">{t('accept')}</Button>
        </div>
      </>
    );
  } else if (step === 5) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">{t('select_difficulty_level_for_your', { type })}</div>
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="mb-8">
            <Slider
              value={[difficulty]}
              onValueChange={([value]) => setDifficulty(value)}
              max={2}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              {difficultyLevels.map((level, index) => (
                <span key={level} className={clsx('text-center', difficulty === index && 'font-bold text-blue-600')}>
                  {level}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setStep(4)} className="bg-blue-500 hover:bg-blue-600">{t('back')}</Button>
          <Button onClick={() => setStep(6)} className="bg-blue-500 hover:bg-blue-600">{t('accept')}</Button>
        </div>
      </>
    );
  } else if (step === 6) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">{t('choose_question_creation_method')}</div>
        <div className="flex gap-8 justify-center mb-8">
          {questionCreateTypes.map((tq) => (
            <Card
              key={tq.id}
              className={clsx(
                'w-64 h-64 flex flex-col items-center justify-center cursor-pointer border-2 transition',
                questionType === tq.id ? 'border-blue-500 shadow-lg' : 'border-slate-200 hover:border-blue-300',
                'rounded-xl'
              )}
              onClick={() => setQuestionType(tq.id)}
            >
              <CardContent className="flex flex-col items-center justify-center h-full w-full">
                <img src={tq.icon} alt={tq.label} className="w-40 h-40 object-contain mb-4 filter invert-0 dark:invert" />
                <span className="text-xl font-bold text-center leading-tight">{tq.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setStep(5)} className="bg-blue-500 hover:bg-blue-600">{t('back')}</Button>
          <Button onClick={() => setStep(7)} disabled={!questionType} className="bg-blue-500 hover:bg-blue-600">{t('accept')}</Button>
        </div>
      </>
    );
  }
  // Step 7: Nhập câu hỏi và lời giải (gộp)
  else if (step === 7 && questionType === 'manual') {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">{t('enter_question_and_solution')}</div>
        <form className="space-y-6 max-w-2xl mx-auto">
          <div>
            <label className="block font-semibold mb-2">{t('question')}</label>
            <TiptapEditor value={manualQuestion} onChange={setManualQuestion} placeholder="Nhập câu hỏi..." />
          </div>
          <div>
            <label className="block font-semibold mb-2">{t('question_source')}</label>
            <ShadInput
              value={manualQuestionSource}
              onChange={e => setManualQuestionSource(e.target.value)}
              className="border border-slate-300 rounded-lg p-3 bg-white text-black dark:bg-[#23272f] dark:text-white"
              placeholder={t('enter_question_source')}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">{t('solution')}</label>
            <TiptapEditor value={manualSolution} onChange={setManualSolution} placeholder={t('enter_solution')} />
          </div>
          <div>
            <label className="block font-semibold mb-2">{t('explanation')}</label>
            <TiptapEditor value={manualExplanation} onChange={setManualExplanation} placeholder={t('enter_explanation')} />
          </div>
        </form>
        <div className="flex justify-between mt-8">
          <Button onClick={() => setStep(6)} className="bg-blue-500 hover:bg-blue-600">{t('back')}</Button>
          <Button
            onClick={() => setStep(8)}
            disabled={
              !manualQuestion.trim() ||
              !manualQuestionSource.trim() ||
              !manualSolution.trim() ||
              !manualExplanation.trim()
            }
            className="bg-blue-500 hover:bg-blue-600"
          >
            {t('accept')}
          </Button>
        </div>
      </>
    );
  }
  // Step 8: Thông tin câu hỏi và lời giải (review)
  else if (step === 8 && questionType === 'manual') {
    const lessonObj = lessons.find(l => l.id === lesson);
      const lessonName = lessonObj ? lessonObj.name : t('no_lesson');
    const difficultyLabel = difficultyLevels[difficulty] || '';
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">{t('review_question_and_solution')}</div>
        <div className="max-w-2xl mx-auto bg-slate-50 dark:bg-[#23272f] text-black dark:text-white rounded-lg p-6 border mb-8">
          <div className="mb-4">
            <span className="font-bold">{t('difficulty_level')}:</span> {difficultyLabel}
          </div>
          <div className="mb-4">
            <span className="font-bold">{t('lesson')}:</span> {lessonName}
          </div>
          <div className="mb-4">
            <div className="font-bold mb-1">{t('question')}:</div>
            <RichTextRenderer html={manualQuestion} />
          </div>
          <div className="mb-4">
            <div className="font-bold mb-1">{t('question_source')}:</div>
            <div>{manualQuestionSource || <span className="italic text-gray-400">({t('no_source')})</span>}</div>
          </div>
          <div className="mb-4">
            <div className="font-bold mb-1">{t('solution')}:</div>
            <RichTextRenderer html={manualSolution} />
          </div>
          <div>
            <div className="font-bold mb-1">{t('explanation')}:</div>
            <RichTextRenderer html={manualExplanation} />
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <Button onClick={() => setStep(7)} className="bg-blue-500 hover:bg-blue-600">{t('back')}</Button>
          <Button
            onClick={() => setShowConfirmModal(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {t('send')}
          </Button>
        </div>
        {/* Modal xác nhận gửi */}
        <ConfirmDialog
          open={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          onConfirm={async () => {
            setIsSubmitting(true);
            try {
              await handleCreateQuestionAndSolution();
              setShowConfirmModal(false);
              setStep(10);
            } catch (e) {
              // Có thể show toast lỗi ở đây
            } finally {
              setIsSubmitting(false);
            }
          }}
          onCancel={() => setShowConfirmModal(false)}
          isSubmitting={isSubmitting}
          title="Confirm Submission"
          message="Are you sure you want to submit this information?"
          note="Once sent, it may not be editable."
          confirmText="Confirm"
          cancelText="Back"
        />
      </>
    );
  }
  // Step 7: Upload files (AI)
  else if (step === 7 && questionType === 'ai') {
    content = (
      <div className="flex flex-col items-center justify-center min-h-[420px]">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-1">{t('upload_files')}</h2>
          <p className="text-gray-500 mb-6">{t('drag_and_drop_your_files_here_or_click_to_browse')}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Area */}
              <div>
          <div
            className={clsx(
              'flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition cursor-pointer',
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white',
                    'min-h-[320px] w-full max-w-lg py-12 px-6 mb-4'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current && inputRef.current.click()}
            style={{ outline: dragActive ? '2px solid #3b82f6' : 'none' }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {!aiImage ? (
              <>
                <div className="flex flex-col items-center justify-center mb-2">
                  <div className="rounded-full bg-gray-100 p-3 mb-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <span className="text-base text-black font-medium">{t('drag_n_drop_files_here_or_click_to_select_files')}</span>
                  <span className="text-xs text-gray-400 mt-1">{t('you_can_upload_1_image_file_up_to_8_mb')}</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                      <img src={URL.createObjectURL(aiImage)} alt="Preview" className="max-h-64 max-w-full rounded shadow" style={{ objectFit: 'contain' }} />
                      <Button variant="outline" size="lg" className="text-base px-6 py-2" onClick={e => { e.stopPropagation(); handleRemove(); }}>{t('remove_image')}</Button>
              </div>
            )}
          </div>
              </div>

              {/* OCR Results */}
              <OCRResultDisplay
                result={ocrResult}
                error={ocrError}
                isProcessing={isProcessingOCR}
                onApplyToField={handleApplyToField}
              />
            </div>

          <div className="flex justify-between mt-8">
            <Button onClick={() => setStep(6)} className="bg-blue-500 hover:bg-blue-600">{t('back')}</Button>
              <Button 
                onClick={() => setShowConfirmModal(true)} 
                disabled={!aiImage || isProcessingOCR} 
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isProcessingOCR ? 'Processing...' : t('send')}
              </Button>
          </div>
        </div>
          
        {/* Modal xác nhận gửi */}
        <ConfirmDialog
          open={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          onConfirm={() => {
            setShowConfirmModal(false);
            setStep(10);
          }}
          onCancel={() => setShowConfirmModal(false)}
          isSubmitting={false}
          title="Confirm Submission"
          message="Are you sure you want to submit this information?"
          note="Once sent, it may not be editable."
          confirmText="Confirm"
          cancelText="Back"
        />
      </div>
    );
  }
  // Step cảm ơn
  else if (step === 10) {
    content = (
      <div className="flex flex-col items-center justify-center min-h-[420px]">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-green-100 p-6 mb-4">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="38" stroke="#4ade80" strokeWidth="4" fill="#f0fdf4" />
              <polyline points="25,43 37,55 57,30" fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Thank you!</h2>
          <p className="text-gray-600 mb-6">Your submission has been sent.</p>
          <div className="flex gap-4">
            <Button onClick={() => window.location.href = '/'} className="bg-blue-500 hover:bg-blue-600">Go Home</Button>
            <Button onClick={() => {
              // Reset wizard về bước đầu và các state liên quan
              setGrade(null);
              setSemester(null);
              setChapter(null);
              setLesson(null);
              setDifficulty(0);
              setQuestionType(null);
              setManualQuestion('');
              setManualSolution('');
              setManualQuestionSource('');
              setManualExplanation('');
              setAiImage(null);
              if (typeof onComplete === 'function') onComplete();
            }} className="bg-green-500 hover:bg-green-600">Continue Create</Button>
          </div>
        </div>
      </div>
    );
    }
  }

  return (
    <Card className="w-full max-w-5xl mx-auto mt-8 p-8">
      <CardHeader className="text-white font-semibold">
        <Stepper value={step} max={(type === 'exam' ? stepsExam.length : stepsQuestion.length) - 1} className="mb-6 text-white font-semibold">
          {( type === 'exam' ? stepsExam : stepsQuestion ).map((s, idx) => (
            <Step key={s.label} value={idx} className="font-semibold">
              <span className="text-black dark:text-white">{s.label}</span>
            </Step>
          ))}
        </Stepper>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};

// ConfirmDialog tái sử dụng
const ConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  isSubmitting,
  title = "Confirm Submission",
  message = "Are you sure you want to submit this information?",
  note = "Once sent, it may not be editable.",
  confirmText = "Confirm",
  cancelText = "Back"
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md mx-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="mb-4 text-center text-lg font-semibold">{message}</div>
      <div className="mb-4 text-center text-sm text-gray-500">{note}</div>
      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={onConfirm}
          className="bg-green-500 hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : confirmText}
        </Button>
        <Button
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-600"
          disabled={isSubmitting}
        >
          {cancelText}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

// CSS chỉ in phần review khi print
const printStyle = `
@media print {
  body * {
    visibility: hidden !important;
  }
  #print-review-section, #print-review-section * {
    visibility: visible !important;
  }
  #print-review-section {
    position: absolute !important;
    left: 0; top: 0; width: 100vw; height: 100vh; background: white !important; z-index: 99999 !important; padding: 32px !important;
  }
}
`;

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  let styleTag = document.getElementById('print-style-tag');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'print-style-tag';
    styleTag.innerHTML = printStyle;
    document.head.appendChild(styleTag);
  }
}

export default MultiStepWizard; 