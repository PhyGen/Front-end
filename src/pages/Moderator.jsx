import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const grades = [
  { id: 1, name: "Lớp 10" },
  { id: 2, name: "Lớp 11" },
  { id: 3, name: "Lớp 12" }
];
const semesters = [
  { id: 1, name: "Học kỳ 1", gradeId: 1 },
  { id: 2, name: "Học kỳ 2", gradeId: 1 }
];
const chapters = [
  { id: 1, name: "Chương I", semesterId: 1 }
];
const lessons = [
  { id: 1, name: "Bài 1", chapterId: 1 }
];
const difficultyLevels = ["Easy", "Medium", "Hard"];

const Moderator = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id;

  // State cho từng form
  const [gradeName, setGradeName] = useState('');
  const [semester, setSemester] = useState({ name: '', gradeId: '' });
  const [chapter, setChapter] = useState({ name: '', semesterId: '' });
  const [lesson, setLesson] = useState({ name: '', chapterId: '' });
  const [question, setQuestion] = useState({
    content: '',
    questionSource: '',
    difficultyLevel: 'Medium',
    lessonId: '',
    createdByUserId: userId || ''
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/landing');
  };

  return (
    <div className="p-8 space-y-8">
      {/* Create Grade */}
      <Card>
        <CardHeader>
          <CardTitle>Create Grade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Tên lớp</Label>
          <Input value={gradeName} onChange={e => setGradeName(e.target.value)} placeholder="Nhập tên lớp" />
          <Button onClick={() => console.log({ name: gradeName })}>Tạo lớp</Button>
        </CardContent>
      </Card>

      {/* Create Semester */}
      <Card>
        <CardHeader>
          <CardTitle>Create Semester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Tên học kỳ</Label>
          <Input value={semester.name} onChange={e => setSemester(s => ({ ...s, name: e.target.value }))} placeholder="Nhập tên học kỳ" />
          <Label>Chọn lớp</Label>
          <Select value={semester.gradeId} onValueChange={v => setSemester(s => ({ ...s, gradeId: v }))}>
            <SelectTrigger><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
            <SelectContent>
              {grades.map(g => <SelectItem key={g.id} value={g.id.toString()}>{g.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => console.log(semester)}>Tạo học kỳ</Button>
        </CardContent>
      </Card>

      {/* Create Chapter */}
      <Card>
        <CardHeader>
          <CardTitle>Create Chapter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Tên chương</Label>
          <Input value={chapter.name} onChange={e => setChapter(s => ({ ...s, name: e.target.value }))} placeholder="Nhập tên chương" />
          <Label>Chọn học kỳ</Label>
          <Select value={chapter.semesterId} onValueChange={v => setChapter(s => ({ ...s, semesterId: v }))}>
            <SelectTrigger><SelectValue placeholder="Chọn học kỳ" /></SelectTrigger>
            <SelectContent>
              {semesters.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => console.log(chapter)}>Tạo chương</Button>
        </CardContent>
      </Card>

      {/* Create Lesson */}
      <Card>
        <CardHeader>
          <CardTitle>Create Lesson</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Tên bài học</Label>
          <Input value={lesson.name} onChange={e => setLesson(s => ({ ...s, name: e.target.value }))} placeholder="Nhập tên bài học" />
          <Label>Chọn chương</Label>
          <Select value={lesson.chapterId} onValueChange={v => setLesson(s => ({ ...s, chapterId: v }))}>
            <SelectTrigger><SelectValue placeholder="Chọn chương" /></SelectTrigger>
            <SelectContent>
              {chapters.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => console.log(lesson)}>Tạo bài học</Button>
        </CardContent>
      </Card>

      {/* Create Question */}
      <Card>
        <CardHeader>
          <CardTitle>Create Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Nội dung câu hỏi</Label>
          <Input value={question.content} onChange={e => setQuestion(q => ({ ...q, content: e.target.value }))} placeholder="Nhập nội dung câu hỏi" />
          <Label>Nguồn câu hỏi</Label>
          <Input value={question.questionSource} onChange={e => setQuestion(q => ({ ...q, questionSource: e.target.value }))} placeholder="Nhập nguồn câu hỏi" />
          <Label>Độ khó</Label>
          <Select value={question.difficultyLevel} onValueChange={v => setQuestion(q => ({ ...q, difficultyLevel: v }))}>
            <SelectTrigger><SelectValue placeholder="Chọn độ khó" /></SelectTrigger>
            <SelectContent>
              {difficultyLevels.map(lv => <SelectItem key={lv} value={lv}>{lv}</SelectItem>)}
            </SelectContent>
          </Select>
          <Label>Chọn bài học</Label>
          <Select value={question.lessonId} onValueChange={v => setQuestion(q => ({ ...q, lessonId: v }))}>
            <SelectTrigger><SelectValue placeholder="Chọn bài học" /></SelectTrigger>
            <SelectContent>
              {lessons.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input value={userId} disabled label="User ID" />
          <Button onClick={() => console.log({ ...question, createdByUserId: userId })}>Tạo câu hỏi</Button>
        </CardContent>
      </Card>

      <Button onClick={handleLogout} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold">Log out</Button>
    </div>
  );
};

export default Moderator; 