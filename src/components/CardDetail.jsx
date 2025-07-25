import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const getFileType = (url) => {
  if (!url) return '';
  const ext = url.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'word';
  return 'other';
};

const CardDetail = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy user từ localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('token'));
  } catch {}

  useEffect(() => {
    if (!itemId) return;
    setLoading(true);
    setError('');
    // Giả sử API công khai là /api/items/:itemId
    fetch(`/api/items/${itemId}`)
      .then(res => {
        if (!res.ok) throw new Error('Không tìm thấy item!');
        return res.json();
      })
      .then(data => setItem(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [itemId]);

  const fileType = getFileType(item?.fileUrl || item?.previewUrl);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <div className="mb-4 text-right text-sm text-gray-500">
        Tài khoản: {user?.email || 'Khách'}
      </div>
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : item ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">{item.title || 'Chi tiết'}</h2>
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            {fileType === 'image' && (
              <img src={item.fileUrl || item.previewUrl} alt={item.title} className="max-w-full max-h-[600px] rounded-lg border" />
            )}
            {fileType === 'pdf' && (
              <iframe
                src={item.fileUrl || item.previewUrl}
                title="PDF Preview"
                className="w-full min-h-[600px] border rounded-lg"
                frameBorder="0"
              />
            )}
            {fileType === 'word' && (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(item.fileUrl || item.previewUrl)}`}
                title="Word Preview"
                className="w-full min-h-[600px] border rounded-lg"
                frameBorder="0"
              />
            )}
            {fileType === 'other' && (
              <div className="text-gray-500">Không hỗ trợ xem trước loại file này.</div>
            )}
            <div className="mt-6 w-full">
              <div className="font-semibold">Mô tả:</div>
              <div className="text-gray-700 whitespace-pre-line">{item.description || 'Không có mô tả.'}</div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CardDetail; 