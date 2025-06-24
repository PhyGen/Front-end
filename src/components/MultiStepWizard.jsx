import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stepper, Step } from '@/components/ui/stepper';
import { Slider } from "@/components/ui/slider";
import clsx from 'clsx';
import semester1 from '@/assets/icons/semester1-logo.jpg';
import semester2 from '@/assets/icons/semester2-logo.jpg';

const steps = [
  { label: 'Grade Level' },
  { label: 'Semester' },
  { label: 'Chapter' },
  { label: 'Lesson' },
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

const MultiStepWizard = ({ onComplete, type }) => {
  const [step, setStep] = useState(0);
  const [grade, setGrade] = useState(null);
  const [semester, setSemester] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [difficulty, setDifficulty] = useState(0); // 0-4 corresponding to difficultyLevels

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
          <Button disabled>Back</Button>
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
  } else if (step === 2) {
    content = (
      <>
        <div className="text-2xl font-semibold text-center mb-6">Select the chapter for your {type}</div>
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
        <Stepper value={step} max={steps.length - 1} className="mb-6">
          {steps.map((s, idx) => (
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