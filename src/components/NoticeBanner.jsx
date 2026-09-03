import { useState, useEffect } from 'react';
import axios from 'axios';

const NoticeBanner = () => {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/api/admin/notice')
      .then(res => setNotice(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!notice || !notice.isActive) return null;

  return (
    <div className="mx-4 md:mx-12 my-6 bg-[#1a1a1a] border-l-4 border-[#E50914] p-4 flex flex-col md:flex-row justify-between items-start md:items-center rounded shadow-lg relative z-10">
      <div>
        <h3 className="text-[#E50914] font-bold mb-1">{notice.title}</h3>
        <p className="text-sm text-gray-400 whitespace-pre-wrap">{notice.message}</p>
      </div>
      {notice.showTelegramButton && (
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-3">
          <a href={notice.telegramLink} target="_blank" rel="noopener noreferrer" className="bg-[#0088cc] hover:bg-[#0077b5] text-white px-4 py-2 rounded font-bold text-sm flex items-center transition">
            Join Our Telegram Channel
          </a>
        </div>
      )}
    </div>
  );
};

export default NoticeBanner;
