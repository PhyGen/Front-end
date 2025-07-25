import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState('');
  const [balance, setBalance] = useState(null);

  // Fetch user balance using /api/users/{id}
  const fetchBalance = async (uid) => {
    if (uid) {
      try {
        const res = await fetch(`https://phygen.ticketresell-swp.click/api/users/${uid}`);
        const data = await res.json();
        if (typeof data.balance !== 'undefined') {
          setBalance(data.balance);
        } else {
          setBalance(null);
        }
      } catch {
        setBalance(null);
      }
    } else {
      setBalance(null);
    }
  };

  // Fetch balance on mount and when user changes
  useEffect(() => {
    if (user && user.id) {
      fetchBalance(user.id);
    } else {
      setBalance(null);
    }
  }, [user]);

  // Khi mở modal, tự động lấy userId nếu có
  useEffect(() => {
    if (showModal) {
      if (user && user.id) {
        setUserId(user.id.toString());
      } else {
        setUserId('');
      }
    }
  }, [showModal, user]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [premiumError, setPremiumError] = useState('');

  const handlePayNow = async () => {
    setError('');
    if (!userId || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Vui lòng nhập đúng userId và số tiền!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://phygen.ticketresell-swp.click/api/Payment/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(userId),
          subscriptionTypeId: 1,
          itemName: 'subscription',
          quantity: 1,
          amount: Number(amount),
          description: 'basic plan',
        })
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
        // Refresh balance after payment
        if (user && user.id) {
          await fetchBalance(user.id);
        }
        setShowModal(false);
        setAmount('');
        setUserId('');
      } else {
        setError('Không lấy được link thanh toán!');
      }
    } catch (e) {
      setError('Có lỗi khi gọi API!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý nâng cấp lên premium
  const handleGoPremium = async () => {
    setPremiumError('');
    if (!user || !user.id) {
      setPremiumError('Bạn cần đăng nhập để nâng cấp!');
      return;
    }
    if (user.isPremium) {
      setPremiumError('Bạn đã là thành viên Premium!');
      return;
    }
    if (balance < 10000) {
      setPremiumError('Số dư không đủ để nâng cấp!');
      return;
    }
    setPremiumLoading(true);
    try {
      const res = await fetch(`https://phygen.ticketresell-swp.click/api/users/premium/${user.id}`, {
        method: 'PUT',
      });
      if (res.status === 200) {
        // Thành công, cập nhật balance và trạng thái premium
        await fetchBalance(user.id);
        window.location.reload(); // reload để cập nhật trạng thái premium
      } else if (res.status === 400) {
        setPremiumError('Không đủ số dư hoặc đã là premium!');
      } else if (res.status === 404) {
        setPremiumError('Không tìm thấy người dùng!');
      } else {
        setPremiumError('Có lỗi xảy ra khi nâng cấp!');
      }
    } catch {
      setPremiumError('Có lỗi khi gọi API!');
    } finally {
      setPremiumLoading(false);
    }
  };

  return (
    <nav className="flex items-center justify-between bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-[#242526] dark:backdrop-blur p-4 shadow-sm border-b rounded-b-2xl">
      <div className="flex gap-6">
        {['about','feature','contact','statistic','question_bank'].map((key) => (
          <Button
            key={key}
            variant="ghost"
            className="text-slate-600 dark:text-white font-medium hover:bg-[#1965fe] hover:text-white dark:hover:bg-[#3a3b3c] dark:hover:text-white"
          >
            {t(key)}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        {balance !== null && (
          <span className="text-base font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-[#23272f] px-3 py-1 rounded-lg border border-blue-200 dark:border-[#3a3b3c]">
            {t('balance')}: {balance.toLocaleString()} VND
          </span>
        )}
        {/* Hiển thị icon premium nếu user.isPremium === true */}
        {user && user.isPremium && (
          <span title="Premium user" className="flex items-center ml-2 px-2 py-1 rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 shadow font-bold text-white animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mr-1">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" fill="#fff" stroke="#fbbf24" />
            </svg>
            <span className="text-yellow-900 font-bold">Premium</span>
          </span>
        )}
        <Button
          variant="outline"
          className="ml-4 bg-[#1965fe] text-white hover:bg-[#1554c0]"
          onClick={() => setShowModal(true)}
        >
          Pay Now
        </Button>
        <Button
          className="ml-2 flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:scale-105 hover:from-yellow-500 hover:to-yellow-400 transition"
          style={{ border: 'none' }}
          onClick={handleGoPremium}
          disabled={premiumLoading || (user && user.isPremium)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mr-1">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" fill="#fff" stroke="#fbbf24" />
          </svg>
          {premiumLoading ? 'Đang xử lý...' : 'Go Premium'}
        </Button>
        {premiumError && (
          <span className="text-red-600 text-sm ml-2">{premiumError}</span>
        )}
      </div>

      {/* Modal nhập số tiền và userId */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#242526] rounded-xl p-6 min-w-[320px] shadow-lg relative" style={{ top: '50%', transform: 'translateY(30%)' }}>
            <button
              className="absolute top-2 right-3 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-[#333] transition"
              onClick={() => setShowModal(false)}
              aria-label="Đóng"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">Thanh toán</h2>
            {/* Ẩn ô nhập userId nếu đã có userId tự động từ AuthContext */}
            {(!user || !user.id) && (
              <div className="mb-3">
                <label className="block mb-1 font-medium">User ID</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-[#333]"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  placeholder="Nhập userId..."
                />
              </div>
            )}
            <div className="mb-3">
              <label className="block mb-1 font-medium">Số tiền (VND)</label>
              <input type="number" className="w-full border rounded px-3 py-2" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Nhập số tiền..." />
            </div>
            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
            <Button
              className="w-full bg-[#1965fe] text-white hover:bg-[#1554c0] mt-2"
              onClick={handlePayNow}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
