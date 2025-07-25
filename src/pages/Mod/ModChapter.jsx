import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import api from '../../config/axios';
import AddIcon from '@/assets/icons/add-symbol-svgrepo-com.svg';
import loadingGif from '@/assets/icons/loading.gif';

function formatDate(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

const ModChapter = () => {
  const [chapters, setChapters] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [grades, setGrades] = useState([]);
  const [newChapter, setNewChapter] = useState({ name: '', semesterId: '' });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState({ id: '', name: '', semesterId: '' });
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({ id: '', name: '', semesterId: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/chapters'),
      api.get('/semesters'),
      api.get('/grades')
    ])
      .then(([chapterRes, semesterRes, gradeRes]) => {
        setChapters(chapterRes.data);
        setSemesters(semesterRes.data);
        setGrades(gradeRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    if (adding) return;
    const nextId = chapters.length > 0 ? Math.max(...chapters.map(c => c.id)) + 1 : 1;
    setNewRow({ id: nextId, name: '', semesterId: '' });
    setAdding(true);
  };

  const handleCancel = () => {
    setAdding(false);
    setNewRow({ id: '', name: '', semesterId: '' });
  };

  const handleCreate = () => {
    if (!newRow.name.trim() || !newRow.semesterId) return;
    setAdding(false);
    setNewRow({ id: '', name: '', semesterId: '' });
    api.post('/chapters', { name: newRow.name, semesterId: newRow.semesterId })
      .then(fetchData)
      .catch(console.error);
  };

  const handleEdit = (id) => {
    const chapter = chapters.find(c => c.id === id);
    if (chapter) {
      setEditId(id);
      setEditRow({ id: id, name: chapter.name, semesterId: chapter.semesterId });
    }
  };

  const handleEditSave = async () => {
    if (!editRow.name.trim() || !editRow.semesterId) return;
    setSaving(true);
    try {
      console.log("Thông tin edit", editRow);
      await api.put(`/chapters/${editRow.id}`, { id: editRow.id, name: editRow.name, semesterId: editRow.semesterId });
      setEditId(null);
      setEditRow({ id: '', name: '', semesterId: '' });
      fetchData();
    } catch (e) {
      alert('Lưu thất bại!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chapter Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2 items-center">
          <Input value={newChapter.name} onChange={e => setNewChapter(s => ({ ...s, name: e.target.value }))} placeholder="Tên chương mới" />
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
                  <th className="px-4 py-2 border">Tên chương</th>
                  <th className="px-4 py-2 border">Học kỳ</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Updated At</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chapters
                  .slice()
                  .sort((a, b) => a.id - b.id)
                  .map(c => {
                    const semester = semesters.find(s => s.id === c.semesterId);
                    const grade = semester ? grades.find(g => g.id === semester.gradeId) : null;
                    if (editId === c.id) {
                      return (
                        <tr key={c.id} className="bg-yellow-50">
                          <td className="px-4 py-2 border font-semibold">{editRow.id}</td>
                          <td className="px-4 py-2 border">
                            <Input value={editRow.name} onChange={e => setEditRow(r => ({ ...r, name: e.target.value }))} placeholder="Nhập tên chương" />
                          </td>
                          <td className="px-4 py-2 border">
                          {(() => {
                          const semester = semesters.find(s => s.id === editRow.semesterId);
                          const grade = semester ? grades.find(g => g.id === semester.gradeId) : null;
                          return semester ? `${semester.name} - Lớp ${semester.gradeName || "-"}` : '-';
                          })()}
                          </td>
                          <td className="px-4 py-2 border">{formatDate(c.createdAt)}</td>
                          <td className="px-4 py-2 border">{formatDate(c.updatedAt)}</td>
                          <td className="px-4 py-2 border flex gap-2">
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleEditSave} disabled={!editRow.name.trim() || !editRow.semesterId}>Save</Button>
                            <Button size="sm" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={() => setEditId(null)}>Cancel</Button>
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={c.id} className="even:bg-slate-50">
                        <td className="px-4 py-2 border">{c.id}</td>
                        <td className="px-4 py-2 border">{c.name}</td>
                        <td className="px-4 py-2 border">{semester.name} - Lớp {semester.gradeName || "-"}</td>
                        <td className="px-4 py-2 border">{formatDate(c.createdAt)}</td>
                        <td className="px-4 py-2 border">{formatDate(c.updatedAt)}</td>
                        <td className="px-4 py-2 border flex gap-2">
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleEdit(c.id)}>Edit</Button>
                        </td>
                      </tr>
                    );
                  })}
                {adding && (
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-2 border font-semibold">{newRow.id}</td>
                    <td className="px-4 py-2 border">
                      <Input value={newRow.name} onChange={e => setNewRow(r => ({ ...r, name: e.target.value }))} placeholder="Nhập tên chương" />
                    </td>
                    <td className="px-4 py-2 border">
                      <Select value={newRow.semesterId} onValueChange={v => setNewRow(r => ({ ...r, semesterId: v }))}>
                        <SelectTrigger className="w-32"><SelectValue placeholder="Chọn học kỳ" /></SelectTrigger>
                        <SelectContent>
                          {semesters.map(s => {
                            const grade = grades.find(g => g.id === s.gradeId);
                            return (
                              <SelectItem key={s.id} value={s.id.toString()}>
                                {s.name}-Lớp{grade ? grade.name : '-'}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border text-slate-400">-</td>
                    <td className="px-4 py-2 border flex gap-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleCreate} disabled={!newRow.name.trim() || !newRow.semesterId}>Create</Button>
                      <Button size="sm" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={handleCancel}>Cancel</Button>
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

export default ModChapter; 