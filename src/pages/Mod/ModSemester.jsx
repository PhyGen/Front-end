import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import api from '../../config/axios';
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

const ModSemester = () => {
  const [semesters, setSemesters] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editRow, setEditRow] = useState({ id: '', name: '', gradeId: '' });
  const [saving, setSaving] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterGradeId, setFilterGradeId] = useState('');

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/semesters'),
      api.get('/grades')
    ])
      .then(([semesterRes, gradeRes]) => {
        console.log('semesterRes:', semesterRes);
        console.log('gradeRes:', gradeRes);
        setSemesters(semesterRes.data || []);
        setGrades(gradeRes.data || []);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setSemesters([]);
        setGrades([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (id) => {
    const semester = semesters.find(s => s && s.id === id);
    if (semester) {
      setEditId(id);
      setEditRow({ id: id, name: semester.name || '', gradeId: semester.gradeId || '' });
    }
  };

  const handleEditSave = async () => {
    if (!editRow.name.trim() || !editRow.gradeId) return;
    setSaving(true);
    try {
      await api.put(`/semesters/${editRow.id}`, { id: editRow.id, name: editRow.name, gradeId: editRow.gradeId });
      setEditId(null);
      setEditRow({ id: '', name: '', gradeId: '' });
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
        <CardTitle>Semester Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto min-h-[120px]">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <img src={loadingGif} alt="loading" className="w-10 h-10" />
            </div>
          ) : semesters.length === 0 ? (
            <div className="flex justify-center items-center h-24 text-gray-500">
              <p>Không có dữ liệu</p>
            </div>
          ) : (
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Tên học kỳ</th>
                  <th className="px-4 py-2 border">Lớp</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border">Updated At</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const filteredSemesters = semesters.filter(s => s && s.id).filter(s =>
                    s.name?.toLowerCase().includes(filterName.toLowerCase()) &&
                    (filterGradeId === "" || s.gradeId?.toString() === filterGradeId)
                  );
                  
                  if (filteredSemesters.length === 0) {
                    return (
                      <tr key="no-data">
                        <td colSpan="6" className="px-4 py-2 border text-center text-gray-500">
                          Không có dữ liệu phù hợp
                        </td>
                      </tr>
                    );
                  }
                  
                  return filteredSemesters.map(s => (
                    editId === s.id ? (
                      <tr key={s.id} className="bg-yellow-50">
                        <td className="px-4 py-2 border font-semibold">{editRow.id}</td>
                        <td className="px-4 py-2 border">
                          <Input value={editRow.name} onChange={e => setEditRow(r => ({ ...r, name: e.target.value }))} placeholder="Nhập tên học kỳ" />
                        </td>
                        <td className="px-4 py-2 border">
                          <Select value={editRow.gradeId} onValueChange={v => setEditRow(r => ({ ...r, gradeId: v }))}>
                            <SelectTrigger className="w-32"><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
                            <SelectContent>
                              {grades.filter(g => g && g.id).map(g => (
                                <SelectItem key={g.id} value={g.id.toString()}>{g.name || 'Unknown'}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-2 border">{formatDate(s.createdAt)}</td>
                        <td className="px-4 py-2 border">{formatDate(s.updatedAt)}</td>
                        <td className="px-4 py-2 border flex gap-2">
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleEditSave} disabled={!editRow.name.trim() || !editRow.gradeId}>Save</Button>
                          <Button size="sm" className="bg-gray-400 hover:bg-gray-500 text-white" onClick={() => setEditId(null)}>Cancel</Button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={s.id} className="even:bg-slate-50">
                        <td className="px-4 py-2 border">{s.id || '-'}</td>
                        <td className="px-4 py-2 border">{s.name || '-'}</td>
                        <td className="px-4 py-2 border">{grades.find(g => g && g.id === s.gradeId)?.gradeName || s.gradeName || '-'}</td>
                        <td className="px-4 py-2 border">{formatDate(s.createdAt)}</td>
                        <td className="px-4 py-2 border">{formatDate(s.updatedAt)}</td>
                        <td className="px-4 py-2 border flex gap-2">
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleEdit(s.id)}>Edit</Button>
                        </td>
                      </tr>
                    )
                  ));
                })()}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModSemester; 