import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '../../config/axios';
import { useNavigate } from 'react-router-dom';
import { uploadImgBBOneFile } from '../../config/imgBB';
import uploadIcon from '../../assets/icons/upload-image-svgrepo-com.svg';

const ModSetting = () => {
  const { user, setUser } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    avatarUrl: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef();

  useEffect(() => {
    if (user && user.id) {
      setLoading(true);
      api.get(`/users/${user.id}`)
        .then(res => {
          setUserInfo(res.data);
          setForm({
            fullName: res.data.fullName || res.data.name || '',
            email: res.data.email || '',
            phoneNumber: res.data.phoneNumber || '',
            avatarUrl: res.data.avatarUrl || ''
          });
        })
        .catch(() => setUserInfo(null))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    setUser(null);
    navigate('/signin');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImgBBOneFile(file);
      setForm(prev => ({ ...prev, avatarUrl: url }));
    } catch (err) {
      setError('Tải ảnh thất bại!');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put(`/users/${user.id}/profile`, form);
      setSuccess('Cập nhật thành công!');
      setEditMode(false);
      // Refresh user info
      const res = await api.get(`/users/${user.id}`);
      setUserInfo(res.data);
      setForm({
        fullName: res.data.fullName || res.data.name || '',
        email: res.data.email || '',
        phoneNumber: res.data.phoneNumber || '',
        avatarUrl: res.data.avatarUrl || ''
      });
    } catch (err) {
      setError('Cập nhật thất bại!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Cài đặt tài khoản</h2>
      {loading ? (
        <div>Đang tải thông tin...</div>
      ) : userInfo ? (
        <>
          {error && <div className="mb-2 text-red-600">{error}</div>}
          {success && <div className="mb-2 text-green-600">{success}</div>}
          {editMode ? (
            <form onSubmit={handleUpdate} className="space-y-4 mb-4">
              <div>
                <label className="block font-medium mb-1">Họ tên</label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block font-medium mb-1">Số điện thoại</label>
                <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block font-medium mb-1">Avatar</label>
                <div className="flex flex-col items-start gap-2">
                  <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="focus:outline-none">
                    <img src={uploadIcon} alt="upload" className="w-14 h-14 hover:scale-105 transition-transform cursor-pointer" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                {uploading && <div className="text-blue-600 text-sm mt-1">Đang tải ảnh...</div>}
                {form.avatarUrl && !uploading && (
                  <div className="mt-2"><img src={form.avatarUrl} alt="avatar preview" className="w-20 h-20 rounded-full object-cover border" /></div>
                )}
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving || uploading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button type="button" onClick={() => { setEditMode(false); setError(''); setSuccess(''); setForm({
                  fullName: userInfo.fullName || userInfo.name || '',
                  email: userInfo.email || '',
                  phoneNumber: userInfo.phoneNumber || '',
                  avatarUrl: userInfo.avatarUrl || ''
                }); }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Hủy</button>
              </div>
            </form>
          ) : (
            <div className="mb-6">
              <div className="mb-2"><b>Email:</b> {userInfo.email}</div>
              <div className="mb-2"><b>Họ tên:</b> {userInfo.fullName || userInfo.name || '-'}</div>
              <div className="mb-2"><b>Số điện thoại:</b> {userInfo.phoneNumber || '-'}</div>
              <div className="mb-2"><b>Avatar:</b> {userInfo.avatarUrl ? <img src={userInfo.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full inline-block" /> : '-'}</div>
              <button onClick={() => setEditMode(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2">Chỉnh sửa</button>
            </div>
          )}
        </>
      ) : (
        <div>Không lấy được thông tin người dùng.</div>
      )}
      <button
        onClick={handleLogout}
        className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold mt-4"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default ModSetting; 