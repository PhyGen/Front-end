import React, { useState,useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stepper, Step } from '@/components/ui/stepper';
import { Slider } from "@/components/ui/slider";
import clsx from 'clsx';
import semester1 from '@/assets/icons/semester1-logo.jpg';
import semester2 from '@/assets/icons/semester2-logo.jpg';
import exam45M from '@/assets/icons/exam-45 minutes.svg';
import semesterExam from '@/assets/icons/semester exam.svg';
import quiz from '@/assets/icons/test-quiz-svgrepo-com.svg';
import avatarIcon from '@/assets/icons/avatar.jpg';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import api from '@/config/axios';
import KNTT from '@/assets/icons/KNTT.png';
import CD from '@/assets/icons/CD.png';
import CTST from '@/assets/icons/CTST.png';
import HandPointer from '@/assets/icons/hand-pointer-event-line-svgrepo-com.svg';
import AIIcon from '@/assets/icons/ai-svgrepo-com.svg';
import { Textarea } from '@/components/ui/textarea';
import { Input as ShadInput } from '@/components/ui/input';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';


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
  { label: 'Difficulty level' },
];

// --- MOCK DATA (giữ lại để fallback khi API lỗi/null) ---
const mockGradeLevels = [{value:10,label:'10'},{value:11,label:'11'},{value:12,label:'12'}];
const mockTextbooks = [
  { id: 1, name: 'Kết nối tri thức với cuộc sống', img: KNTT },
  { id: 2, name: 'Cánh diều', img: CD },
  { id: 3, name: 'Chân trời sáng tạo', img: CTST },
];
const mockSemesters = [
  { value: 1, label: '1st Semester', img: semester1 },
  { value: 2, label: '2nd Semester', img: semester2 },
];
const mockChapters = [
  { id: 1, title: 'Chương I : Mở đầu', semesterId: 1 },
  { id: 2, title: 'Chương II. Động học', semesterId: 1 },
  { id: 3, title: 'Chương III. Động lực học', semesterId: 1 },
  { id: 4, title: 'Chương IV. Năng lượng, công, công suất', semesterId: 2 },
  { id: 5, title: 'Chương V. Động lượng', semesterId: 2 },
  { id: 6, title: 'Chương VI. Chuyển động tròn', semesterId: 2 },
  { id: 7, title: 'Chương VII. Biến dạng của vật rắn. Áp', semesterId: 2 },
];
const mockLessons = [
  { id: 1, title: 'Bài 4. Độ dịch chuyển và quãng đường đi được', chapterId: 1 },
  { id: 2, title: 'Bài 5. Tốc độ và vận tốc', chapterId: 1 },
  { id: 3, title: 'Bài 6. Thực hành: Đo tốc độ của vật chuyển động', chapterId: 2 },
  { id: 4, title: 'Bài 7. Đồ thị độ dịch chuyển - thời gian', chapterId: 2 },
  { id: 5, title: 'Bài 8. Chuyển động biến đổi. Gia tốc', chapterId: 3 },
  { id: 6, title: 'Bài 9. Chuyển động thẳng biến đổi đều', chapterId: 3 },
  { id: 7, title: 'Bài 10. Sự rơi tự do', chapterId: 4 },
];
const mockQuestionList = [
  { id: 1, title: 'The Question', avatar: avatarIcon, lessonId: 1 },
  { id: 2, title: 'The Question', avatar: avatarIcon, lessonId: 1 },
];
// --- END MOCK DATA ---

const difficultyLevels = ['Easy','Medium','Hard'];

const examTypes = [
  { id: 1, label: 'Quiz', icon: quiz },
  { id: 2, label: 'Midterm', icon: exam45M },
  { id: 3, label: 'Final', icon: semesterExam },
];

const questionCreateTypes = [
  { id: 'manual', label: 'Tạo thủ công', icon: HandPointer },
  { id: 'ai', label: 'Nhận diện từ ảnh', icon: AIIcon },
];

const MultiStepWizard = ({ onComplete, type, onBack }) => {
  const { t } = useTranslation();
  // --- State động ---
  const [gradeLevels, setGradeLevels] = useState(mockGradeLevels);
  const [semesters, setSemesters] = useState(mockSemesters);
  const [chapters, setChapters] = useState(mockChapters);
  const [lessons, setLessons] = useState(mockLessons);
  const [questionList, setQuestionList] = useState(mockQuestionList);
  const [textbooks, setTextbooks] = useState(mockTextbooks);
  const [textbook, setTextbook] = useState(null); // id
  // --- State lựa chọn ---
  const [step, setStep] = useState(0);
  const [grade, setGrade] = useState(null); // sẽ là id hoặc encodedId
  const [semester, setSemester] = useState(null); // sẽ là id
  const [chapter, setChapter] = useState(null); // sẽ là id
  const [lesson, setLesson] = useState(null); // sẽ là id
  const [difficulty, setDifficulty] = useState(0); // 0-4 corresponding to difficultyLevels
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [filterChapter, setFilterChapter] = useState(null);
  const [filterLesson, setFilterLesson] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState(null);
  const [questionType, setQuestionType] = useState(null);
  const [manualQuestion, setManualQuestion] = useState('');
  const [manualSolution, setManualSolution] = useState('');
  const [manualSolutionLink, setManualSolutionLink] = useState('');
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
    }
  }
  function handleRemove() {
    setAiImage(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  const handleSelectQuestion = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  // --- API: Lấy gradeLevels khi mount ---
  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/grades');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setGradeLevels(res.data.map(g => ({ ...g, label: g.name, value: g.encodedId || g.id })));
        } else {
          setGradeLevels(mockGradeLevels);
        }
      } catch {
        setGradeLevels(mockGradeLevels);
      }
    })();
  }, []);

  // --- API: Lấy textbooks khi chọn grade ---
  React.useEffect(() => {
    if (!grade) return;
    (async () => {
      try {
        const res = await api.get('/text-books');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setTextbooks(res.data.filter(tb => tb.gradeId === grade));
        } else {
          setTextbooks(mockTextbooks);
        }
      } catch {
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
        const res = await api.get(`/semesters/by-grade/${grade}`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSemesters(res.data.map(s => ({ ...s, value: s.id, label: s.name, img: s.value === 1 ? semester1 : semester2 })));
        } else {
          setSemesters(mockSemesters);
        }
      } catch {
        setSemesters(mockSemesters);
      }
    })();
    // Reset các bước sau
    setSemester(null); setChapter(null); setLesson(null); setChapters([]); setLessons([]); setQuestionList([]);
  }, [grade]);

  // --- API: Lấy chapters khi chọn semester ---
  React.useEffect(() => {
    if (!semester) return;
    (async () => {
      try {
        const res = await api.get('/chapters');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setChapters(res.data.filter(c => c.semesterId === semester));
        } else {
          setChapters(mockChapters.filter(c => c.semesterId === semester));
        }
      } catch {
        setChapters(mockChapters.filter(c => c.semesterId === semester));
      }
    })();
    setChapter(null); setLesson(null); setLessons([]); setQuestionList([]);
  }, [semester]);

  // --- API: Lấy lessons khi chọn chapter ---
  React.useEffect(() => {
    if (!chapter) return;
    (async () => {
      try {
        const res = await api.get(`/lessons?chapterId=${chapter}`);
        if (res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
          setLessons(res.data.items);
        } else {
          setLessons(mockLessons.filter(l => l.chapterId === chapter));
        }
      } catch {
        setLessons(mockLessons.filter(l => l.chapterId === chapter));
      }
    })();
    setLesson(null); setQuestionList([]);
  }, [chapter]);

  // --- API: Lấy questionList khi chọn lesson ---
  React.useEffect(() => {
    if (!lesson) return;
    (async () => {
      try {
        const res = await api.get(`/questions?lessonId=${lesson}`);
        if (res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
          setQuestionList(res.data.items);
        } else {
          setQuestionList(mockQuestionList.filter(q => q.lessonId === lesson));
        }
      } catch {
        setQuestionList(mockQuestionList.filter(q => q.lessonId === lesson));
      }
    })();
  }, [lesson]);

  // UI step labels (for Stepper)
  const stepsQuestion = [
    { label: t('grade_level') },
    { label: t('textbook') },
    { label: t('semester') },
    { label: t('chapter') },
    { label: t('lesson') },
    { label: t('difficulty_level') },
  ];
  const stepsExam = [
    { label: t('grade_level') },
    { label: t('semester') },
    { label: t('type') },
    { label: t('questions') },
    { label: t('difficulty_level') },
  ];

  // Render step content
  let content = null;
  if (step === 0) {
    // Grade Level
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
              onClick={() => setGrade(g.value)}
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
    // Textbook
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
                <img src={tb.img} alt={tb.name} className="w-40 h-40 object-contain mb-4" />
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
    // Semester
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
                <img src={s.img} alt={s.label} className="w-40 h-40 object-contain" />
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
    // Chapter
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">{t('select_chapter_for_your', { type })}</div>
        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto mb-8">
          {chapters.map((c) => (
            <Card
              key={c.id}
              className={clsx(
                'cursor-pointer border-2 transition p-4',
                chapter === c.id ? 'border-blue-500 shadow-lg bg-blue-50' : 'border-slate-200 hover:border-blue-300'
              )}
              onClick={() => setChapter(c.id)}
            >
              <CardContent className="p-2">
                <span className="text-sm font-medium">{c.title}</span>
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
    // Lesson
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">{t('select_lesson_for_your', { type })}</div>
        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto mb-8">
          {lessons.map((l) => (
            <Card
              key={l.id}
              className={clsx(
                'cursor-pointer border-2 transition p-4',
                lesson === l.id ? 'border-blue-500 shadow-lg bg-blue-50' : 'border-slate-200 hover:border-blue-300'
              )}
              onClick={() => setLesson(l.id)}
            >
              <CardContent className="p-2">
                <span className="text-sm font-medium">{l.title}</span>
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
    // Difficulty level
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
    // Chọn loại tạo câu hỏi
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
                <img src={tq.icon} alt={tq.label} className="w-40 h-40 object-contain mb-4" />
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
  } else if (step === 7 && questionType === 'manual') {
    // UI form nhập thủ công
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">{t('enter_question_and_solution')}</div>
        <form className="space-y-6 max-w-2xl mx-auto">
          <div>
            <label className="block font-semibold mb-2">{t('question')}</label>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{t('insert_symbol')}</span>
              {physicsSymbols.map(s => (
                <button type="button" key={s.symbol} className="px-2 py-1 rounded hover:bg-blue-100 text-lg" onClick={() => setManualQuestion(manualQuestion + s.symbol)} title={s.label}>{s.symbol}</button>
              ))}
            </div>
            <ReactQuill
              value={manualQuestion}
              onChange={setManualQuestion}
              modules={quillModules}
              theme="snow"
              style={{ background: 'white', color: 'black' }}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">{t('solution')}</label>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{t('insert_symbol')}</span>
              {physicsSymbols.map(s => (
                <button type="button" key={s.symbol} className="px-2 py-1 rounded hover:bg-blue-100 text-lg" onClick={() => setManualSolution(manualSolution + s.symbol)} title={s.label}>{s.symbol}</button>
              ))}
            </div>
            <ReactQuill
              value={manualSolution}
              onChange={setManualSolution}
              modules={quillModules}
              theme="snow"
              style={{ background: 'white', color: 'black' }}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">{t('solution_link')}</label>
            <ShadInput
              value={manualSolutionLink}
              onChange={e => setManualSolutionLink(e.target.value)}
              className="bg-white text-black border border-slate-300 rounded-lg p-3"
              placeholder={t('enter_solution_link_if_any')}
            />
          </div>
        </form>
        <div className="flex justify-between mt-8">
          <Button onClick={() => setStep(6)} className="bg-blue-500 hover:bg-blue-600">{t('back')}</Button>
          <Button
            onClick={() => onComplete({ grade, semester, chapter, lesson, difficulty: difficultyLevels[difficulty], questionType, manualQuestion, manualSolution, manualSolutionLink })}
            disabled={!manualQuestion.trim() || !manualSolution.trim()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {t('accept')}
          </Button>
        </div>
      </>
    );
  } else if (step === 7 && questionType === 'ai') {
    content = (
      <div className="flex flex-col items-center justify-center min-h-[420px]">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-1">{t('upload_files')}</h2>
          <p className="text-gray-500 mb-6">{t('drag_and_drop_your_files_here_or_click_to_browse')}</p>
          <div
            className={clsx(
              'flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition cursor-pointer',
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white',
              'min-h-[220px] w-full py-8 mb-4'
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
                  <span className="text-base text-gray-600 font-medium">{t('drag_n_drop_files_here_or_click_to_select_files')}</span>
                  <span className="text-xs text-gray-400 mt-1">{t('you_can_upload_1_image_file_up_to_8_mb')}</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <img src={URL.createObjectURL(aiImage)} alt="Preview" className="max-h-48 rounded shadow" />
                <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); handleRemove(); }}>{t('remove_image')}</Button>
              </div>
            )}
          </div>
          <div className="flex justify-between mt-8">
            <Button onClick={() => setStep(6)} className="bg-blue-500 hover:bg-blue-600">{t('back')}</Button>
            <Button onClick={() => onComplete({ grade, semester, chapter, lesson, difficulty: difficultyLevels[difficulty], questionType, aiImage })} disabled={!aiImage} className="bg-blue-500 hover:bg-blue-600">{t('accept')}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8 p-4">
      <CardHeader>
        <Stepper value={step} max={(type === 'exam' ? stepsExam.length : stepsQuestion.length) - 1} className="mb-6">
          {( type === 'exam' ? stepsExam : stepsQuestion ).map((s, idx) => (
            <Step key={s.label} value={idx}>
              {s.label}
            </Step>
          ))}
        </Stepper>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};

export default MultiStepWizard; 