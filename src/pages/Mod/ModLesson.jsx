import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import api from '../../config/axios';
import AddIcon from '@/assets/icons/add-symbol-svgrepo-com.svg';
import loadingGif from '@/assets/icons/loading.gif';

const ModLesson = () => {
  const [lessons, setLessons] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [newLesson, setNewLesson] = useState({ name: '', chapterId: '' });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState({ id: '', name: '', chapterId: '' });
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({ id: '', name: '', chapterId: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/lessons'),
      api.get('/chapters')
    ])
      .then(([lessonRes, chapterRes]) => {
        setLessons(lessonRes.data);
        setChapters(chapterRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    if (adding) return;
    const nextId = lessons.length > 0 ? Math.max(...lessons.map(l => l.id)) + 1 : 1;
    setNewRow({ id: nextId, name: '', chapterId: '' });
    setAdding(true);
  };

  const handleCancel = () => {
    setAdding(false);
    setNewRow({ id: '', name: '', chapterId: '' });
  };

  const handleCreate = () => {
    if (!newRow.name.trim() || !newRow.chapterId) return;
    setLessons([...lessons, { ...newRow, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    setAdding(false);
    setNewRow({ id: '', name: '', chapterId: '' });
  };

  const handleEdit = (id) => {
    const lesson = lessons.find(l => l.id === id);
    if (lesson) {
      setEditId(id);
      setEditRow({ id: id, name: lesson.name, chapterId: lesson.chapterId });
    }
  };

  const handleEditSave = async () => {
    if (!editRow.name.trim() || !editRow.chapterId) return;
    setSaving(true);
    try {
      await api.put(`/lessons/${editRow.id}`, { id: editRow.id, name: editRow.name, chapterId: editRow.chapterId });
      setLessons(lessons.map(l => l.id === editRow.id ? { ...l, name: editRow.name, chapterId: editRow.chapterId } : l));
      setEditId(null);
      setEditRow({ id: '', name: '', chapterId: '' });
    } catch (e) {
      alert('Lưu thất bại!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/lessons/${id}`);
      setLessons(lessons.filter(l => l.id !== id));
    } catch (e) {
      alert('Xóa thất bại!');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-center">
          <Input value={newLesson.name} onChange={e => setNewLesson(s => ({ ...s, name: e.target.value }))} placeholder="Tên bài mới" />
          <Select value={newLesson.chapterId} onValueChange={v => setNewLesson(s => ({ ...s, chapterId: v }))}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Chọn chương" /></SelectTrigger>
            <SelectContent>
              {chapters.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} className="flex items-center gap-1 bg-black hover:bg-neutral-800 text-white">
            <img src={AddIcon} alt="add" className="w-4 h-4" />
            Thêm
          </Button>
        </div>
        <div className="overflow-x-auto min-h-[120px]">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <img src={loadingGif} alt="loading" className="w-10 h-10" />
            </div>
          ) : (
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Tên bài</th>
                  <th className="px-4 py-2 border">Chương</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Updated At</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map(l => (
                  <tr key={l.id} className="even:bg-slate-50">
                    <td className="px-4 py-2 border">{l.id}</td>
                    <td className="px-4 py-2 border">{l.name}</td>
                    <td className="px-4 py-2 border">{chapters.find(c => c.id === l.chapterId)?.name || l.chapterId}</td>
                    <td className="px-4 py-2 border">{l.createdAt}</td>
                    <td className="px-4 py-2 border">{l.updatedAt}</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleEdit(l.id)}>Edit</Button>
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(l.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
                {adding && (
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-2 border font-semibold">{newRow.id}</td>
                    <td className="px-4 py-2 border">
                      <Input value={newRow.name} onChange={e => setNewRow(r => ({ ...r, name: e.target.value }))} placeholder="Nhập tên bài" />
                    </td>
                    <td className="px-4 py-2 border">
                      <Select value={newRow.chapterId} onValueChange={v => setNewRow(r => ({ ...r, chapterId: v }))}>
                        <SelectTrigger className="w-32"><SelectValue placeholder="Chọn chương" /></SelectTrigger>
                        <SelectContent>
                          {chapters.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleCreate} disabled={!newRow.name.trim() || !newRow.chapterId}>Create</Button>
                      <Button size="sm" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={handleCancel}>Cancel</Button>
                    </td>
                  </tr>
                )}
                {editId && (
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-2 border font-semibold">{editRow.id}</td>
                    <td className="px-4 py-2 border">
                      <Input value={editRow.name} onChange={e => setEditRow(r => ({ ...r, name: e.target.value }))} placeholder="Nhập tên bài" />
                    </td>
                    <td className="px-4 py-2 border">
                      <Select value={editRow.chapterId} onValueChange={v => setEditRow(r => ({ ...r, chapterId: v }))}>
                        <SelectTrigger className="w-32"><SelectValue placeholder="Chọn chương" /></SelectTrigger>
                        <SelectContent>
                          {chapters.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleEditSave} disabled={!editRow.name.trim() || !editRow.chapterId}>Save</Button>
                      <Button size="sm" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={() => setEditId(null)}>Cancel</Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModLesson; 