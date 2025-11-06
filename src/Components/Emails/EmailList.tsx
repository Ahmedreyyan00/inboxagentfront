"use client";

import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa6";
import dayjs from "dayjs";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import axios from "axios";
import { getSession } from "next-auth/react";
import Lottie from "lottie-react";
import scanningAnimation from "../../../public/animations/Loading Animation.json";


type EmailItem = {
  id: string;
  subject?: string;
  from?: string;
  date?: string | Date;
  body?: string;
};

export default function EmailList() {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<EmailItem | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, [page, search]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      // Load from cache by default
      const res = await Api.getCachedEmails();
      const list: EmailItem[] = (res.data.emails || []).map((e: any) => ({
        id: e.id,
        subject: e.subject,
        from: e.from,
        date: e.date,
        body: e.body,
      }));
      const filtered = search
        ? list.filter(
            (e) =>
              (e.subject || "").toLowerCase().includes(search.toLowerCase()) ||
              (e.from || "").toLowerCase().includes(search.toLowerCase())
          )
        : list;
      const pageSize = 10;
      setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));
      const start = (page - 1) * pageSize;
      setEmails(filtered.slice(start, start + pageSize));
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    try {
      setScanning(true);
      const session = await getSession();
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseURL) throw new Error("API base URL not set");
      if (!session?.accessToken) throw new Error("Missing auth token");
      await axios.post(
        `${baseURL}/api/mail/scan-cache`,
        { count: 10 },
        { headers: { Authorization: session.accessToken } }
      );
      toast.success("Scanned latest 10 emails and updated cache");
      // reload cache
      setPage(1);
      await fetchEmails();
    } finally {
      setScanning(false);
    }
  };

  const handleScanSafe = async () => {
    try {
      await handleScan();
    } catch (e: any) {
      console.error(e);
      const msg = e?.response?.data?.error || e?.message || "Scan failed";
      toast.error(msg);
    }
  };

  const openModal = (email: EmailItem) => {
    setSelected(email);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <main className="p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl mb-2" style={{ color: 'var(--card-accent)' }}>All Emails</h1>
        <p className="text-neutral-600 text-sm sm:text-base">Recent emails fetched from your connected account(s).</p>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center">
        <button
          onClick={handleScanSafe}
          disabled={scanning}
          className="px-4 py-2 border-2 rounded-lg transition-all hover:shadow-sm"
          style={{ borderColor: 'var(--card-border-light)', color: 'var(--card-accent)' }}
        >
          {scanning ? 'Scanning…' : 'Scan latest 10 emails'}
        </button>
        <input
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          placeholder="Search by subject or sender"
          className="w-full max-w-md px-3 py-2 border-2 rounded-lg"
          style={{ borderColor: 'var(--card-border-light)' }}
        />
      </div>
      {scanning ? (
        <div className="w-full flex justify-center">
          <Lottie animationData={scanningAnimation} loop={true} style={{ width: 600, height: 600 }} />
        </div>
      ) : (
        <div className="rounded-lg border-2 overflow-x-auto" style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}>
          {loading ? (
            <div className="p-6">Loading…</div>
          ) : emails.length === 0 ? (
            <div className="p-6">No emails found</div>
          ) : (
            <table className="w-full min-w-[720px]">
              <thead className="border-b-2" style={{ borderColor: 'var(--card-border-light)' }}>
                <tr>
                  <th className="px-4 py-3 text-left" style={{ color: 'var(--card-accent)' }}>Date</th>
                  <th className="px-4 py-3 text-left" style={{ color: 'var(--card-accent)' }}>From</th>
                  <th className="px-4 py-3 text-left" style={{ color: 'var(--card-accent)' }}>Subject</th>
                  <th className="px-4 py-3 text-left" style={{ color: 'var(--card-accent)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emails.map((email) => (
                  <tr key={email.id} className="border-b" style={{ borderColor: 'var(--card-border-light)' }}>
                    <td className="px-4 py-3" style={{ color: '#1e40af' }}>{email.date ? dayjs(email.date).format('DD/MM/YYYY HH:mm') : ''}</td>
                    <td className="px-4 py-3" style={{ color: '#1e40af' }}>{email.from || ''}</td>
                    <td className="px-4 py-3" style={{ color: '#1e40af' }}>{email.subject || ''}</td>
                    <td className="px-4 py-3">
                      <button title="View Email" onClick={() => openModal(email)}>
                        <FaEye style={{ color: '#3b82f6' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="p-4 flex items-center justify-between border-t-2" style={{ borderColor: 'var(--card-border-light)' }}>
            <div className="text-sm" style={{ color: 'var(--card-accent)' }}>Page {page} of {totalPages}</div>
            <div className="flex gap-2">
              <button disabled={page===1} onClick={() => setPage(Math.max(1, page-1))} className="px-3 py-1 border-2 rounded" style={{ borderColor: 'var(--card-accent)', color: 'var(--card-accent)' }}>Prev</button>
              <button disabled={page===totalPages} onClick={() => setPage(Math.min(totalPages, page+1))} className="px-3 py-1 border-2 rounded" style={{ borderColor: 'var(--card-accent)', color: 'var(--card-accent)' }}>Next</button>
            </div>
          </div>
        </div>
      )}

      {open && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeModal}>
          <div 
            className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-4 border-b" style={{ borderColor: 'var(--card-border-light)' }}>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--card-accent)' }}>Email</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-xl leading-none">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                <div><span className="font-medium">From:</span> {selected.from || ''}</div>
                <div><span className="font-medium">Subject:</span> {selected.subject || ''}</div>
                <div><span className="font-medium">Date:</span> {selected.date ? dayjs(selected.date).format('DD/MM/YYYY HH:mm') : ''}</div>
                <div className="mt-4 whitespace-pre-wrap text-sm text-gray-700 break-words">{selected.body || '(No body available)'}</div>
              </div>
            </div>
            <div className="p-6 pt-4 border-t text-right" style={{ borderColor: 'var(--card-border-light)' }}>
              <button onClick={closeModal} className="px-4 py-2 rounded border" style={{ borderColor: 'var(--card-border-light)' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


