import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stepper, Step } from '@/components/ui/stepper';
import { Slider } from "@/components/ui/slider";
import clsx from 'clsx';
import semester1 from '@/assets/icons/semester1-logo.jpg';
import semester2 from '@/assets/icons/semester2-logo.jpg';
import exam45M from '@/assets/icons/exam-45 minutes.svg';
import semesterExam from '@/assets/icons/semester exam.svg';
import avatarIcon from '@/assets/icons/avatar.jpg';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

const stepsQuestion = [
  { label: 'Grade Level' },
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

const gradeLevels = [10, 11, 12];
const semesters = [
  { value: 1, label: '1st Semester', img: semester1 },
  { value: 2, label: '2nd Semester', img: semester2 },
];

const chapters = [
  { id: 1, title: 'Chương I : Mở đầu' },
  { id: 2, title: 'Chương II. Động học' },
  { id: 3, title: 'Chương III. Động lực học' },
  { id: 4, title: 'Chương IV. Năng lượng, công, công suất' },
  { id: 5, title: 'Chương V. Động lượng' },
  { id: 6, title: 'Chương VI. Chuyển động tròn' },
  { id: 7, title: 'Chương VII. Biến dạng của vật rắn. Áp' },
];

const lessons = [
  { id: 1, title: 'Bài 4. Độ dịch chuyển và quãng đường đi được' },
  { id: 2, title: 'Bài 5. Tốc độ và vận tốc' },
  { id: 3, title: 'Bài 6. Thực hành: Đo tốc độ của vật chuyển động' },
  { id: 4, title: 'Bài 7. Đồ thị độ dịch chuyển - thời gian' },
  { id: 5, title: 'Bài 8. Chuyển động biến đổi. Gia tốc' },
  { id: 6, title: 'Bài 9. Chuyển động thẳng biến đổi đều' },
  { id: 7, title: 'Bài 10. Sự rơi tự do' },
];

const difficultyLevels = ['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];

const examTypes = [
  { id: '45min', label: '45-minute exam', icon: exam45M },
  { id: 'semester', label: 'Semester exam', icon: semesterExam },
];

const questionList = [
  { id: 1, title: 'The Question', avatar: avatarIcon },
  { id: 2, title: 'The Question', avatar: avatarIcon },
  // ... có thể thêm nhiều câu hỏi khác
];

const MultiStepWizard = ({ onComplete, type, onBack }) => {
  const [step, setStep] = useState(0);
  const [grade, setGrade] = useState(null);
  const [semester, setSemester] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [difficulty, setDifficulty] = useState(0); // 0-4 corresponding to difficultyLevels
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [filterChapter, setFilterChapter] = useState(null);
  const [filterLesson, setFilterLesson] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState(null);

  const handleSelectQuestion = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  // Render step content
  let content = null;
  if (step === 0) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">Select the grade level for your {type}</div>
        <div className="flex gap-8 justify-center mb-8">
          {gradeLevels.map((g) => (
            <Card
              key={g}
              className={clsx(
                'w-48 h-64 flex items-center justify-center cursor-pointer border-2 transition',
                grade === g ? 'border-blue-500 shadow-lg' : 'border-slate-200 hover:border-blue-300'
              )}
              onClick={() => setGrade(g)}
            >
              <CardContent className="flex items-center justify-center h-full">
                <span className="text-6xl font-bold">{g}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={onBack} className="bg-blue-500 hover:bg-blue-600">Back</Button>
          <Button onClick={() => setStep(1)} disabled={!grade} className="bg-blue-500 hover:bg-blue-600">Accept</Button>
        </div>
      </>
    );
  } else if (step === 1) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">Select the semester for your {type}</div>
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
          <Button onClick={() => setStep(0)} className="bg-blue-500 hover:bg-blue-600">Back</Button>
          <Button onClick={() => setStep(2)} disabled={!semester} className="bg-blue-500 hover:bg-blue-600">Accept</Button>
        </div>
      </>
    );
  } else if (step === 2 && type === 'exam') {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">Select type for your exam</div>
        <div className="flex gap-8 justify-center mb-8">
          {examTypes.map((et) => (
            <Card
              key={et.id}
              className={clsx(
                'w-64 h-64 flex flex-col items-center justify-center cursor-pointer border-2 transition',
                selectedExamType === et.id ? 'border-blue-500 shadow-lg' : 'border-slate-200 hover:border-blue-300'
              )}
              onClick={() => setSelectedExamType(et.id)}
            >
              <CardContent className="flex flex-col items-center justify-center h-full">
                <img src={et.icon} alt={et.label} className="w-24 h-24 mb-4" />
                <span className="text-xl font-bold">{et.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setStep(1)} className="bg-blue-500 hover:bg-blue-600">Back</Button>
          <Button onClick={() => setStep(3)} disabled={!selectedExamType} className="bg-blue-500 hover:bg-blue-600">Accept</Button>
        </div>
      </>
    );
  } else if (step === 3 && type === 'exam') {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">Select questions for your exam</div>
        <div className="flex justify-center mb-4">
          <Input
            placeholder="Search or filter questions..."
            className="w-full max-w-md cursor-pointer"
            readOnly
            onClick={() => setSearchModalOpen(true)}
          />
        </div>
        <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="mb-4 text-2xl">Filter Questions</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-2">
              <div className="flex flex-col gap-2">
                <Label className="mb-1">Chapter</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {filterChapter ? chapters.find(c => c.id === filterChapter)?.title : 'Select chapter'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {chapters.map(c => (
                      <DropdownMenuItem key={c.id} onClick={() => setFilterChapter(c.id)}>
                        {c.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="mb-1">Lesson</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {filterLesson ? lessons.find(l => l.id === filterLesson)?.title : 'Select lesson'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {lessons.map(l => (
                      <DropdownMenuItem key={l.id} onClick={() => setFilterLesson(l.id)}>
                        {l.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="mb-1">Difficulty Level</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {filterDifficulty !== null ? difficultyLevels[filterDifficulty] : 'Select difficulty'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {difficultyLevels.map((level, idx) => (
                      <DropdownMenuItem key={level} onClick={() => setFilterDifficulty(idx)}>
                        {level}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => {
                  setFilterChapter(null); setFilterLesson(null); setFilterDifficulty(null); setSearchModalOpen(false);
                }}>Cancel</Button>
                <Button 
                  onClick={() => setSearchModalOpen(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Apply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div className="flex gap-8 justify-center mb-8">
          {questionList.map((q) => (
            <Card
              key={q.id}
              className={clsx(
                'w-48 h-64 flex flex-col items-center justify-center cursor-pointer border-2 transition',
                selectedQuestions.includes(q.id) ? 'border-blue-500 shadow-lg bg-blue-50 dark:bg-[#23272f]' : 'border-slate-200 hover:border-blue-300'
              )}
              onClick={() => handleSelectQuestion(q.id)}
            >
              <CardContent className="flex flex-col items-center justify-center h-full">
                <img src={q.avatar} alt={q.title} className="w-20 h-20 mb-2 rounded-full" />
                <span className="text-lg font-medium">{q.title}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setStep(2)} className="bg-blue-500 hover:bg-blue-600">Back</Button>
          <Button onClick={() => setStep(4)} disabled={selectedQuestions.length === 0} className="bg-blue-500 hover:bg-blue-600">Accept</Button>
        </div>
      </>
    );
  } else if (step === 2) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">Select the chapter for your {type}</div>
        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto mb-8">
          {chapters.map((c) => (
            <div
              key={c.id}
              className={clsx(
                'p-4 border-2 rounded-lg cursor-pointer transition',
                chapter === c.id ? 'bg-blue-600 text-white' : 'border-slate-200 hover:border-blue-300'
              )}
              onClick={() => setChapter(c.id)}
            >
              {c.title}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setStep(1)} className="bg-blue-500 hover:bg-blue-600">Back</Button>
          <Button onClick={() => setStep(3)} disabled={!chapter} className="bg-blue-500 hover:bg-blue-600">Accept</Button>
        </div>
      </>
    );
  } else if (step === 3) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">Select the lesson for your {type}</div>
        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto mb-8">
          {lessons.map((l) => (
            <div
              key={l.id}
              className={clsx(
                'p-4 border-2 rounded-lg cursor-pointer transition',
                lesson === l.id ? 'bg-blue-600 text-white' : 'border-slate-200 hover:border-blue-300'
              )}
              onClick={() => setLesson(l.id)}
            >
              {l.title}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setStep(2)} className="bg-blue-500 hover:bg-blue-600">Back</Button>
          <Button onClick={() => setStep(4)} disabled={!lesson} className="bg-blue-500 hover:bg-blue-600">Accept</Button>
        </div>
      </>
    );
  } else if (step === 4) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">Select the difficulty level for your {type}</div>
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="mb-8">
            <Slider
              value={[difficulty]}
              onValueChange={([value]) => setDifficulty(value)}
              max={4}
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
          <Button onClick={() => setStep(3)} className="bg-blue-500 hover:bg-blue-600">Back</Button>
          <Button 
            onClick={() => onComplete({ grade, semester, chapter, lesson, difficulty: difficultyLevels[difficulty] })} 
            className="bg-blue-500 hover:bg-blue-600"
          >
            Accept
          </Button>
        </div>
      </>
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