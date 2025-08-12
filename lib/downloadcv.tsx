"use client"
import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';

const DownloadLatestCV = () => {
        const t = useTranslations('HomePage');
  const [fileBlobUrl, setFileBlobUrl] = useState('');
  const [fileName, setFileName] = useState('Download CV');

  useEffect(() => {
    const fetchLatestFile = async () => {
      const { data: files, error } = await supabase.storage
        .from('cv-files')
        .list('', { sortBy: { column: 'created_at', order: 'desc' } });

      if (error || !files || files.length === 0) {
        console.error('No files found or error:', error);
        return;
      }

      const latestFile = files[0];
      setFileName(latestFile.name);

      const { data, error: downloadError } = await supabase.storage
        .from('cv-files')
        .download(latestFile.name);

      if (downloadError) {
        console.error('Error downloading file:', downloadError);
        return;
      }

      const blobUrl = window.URL.createObjectURL(data);
      setFileBlobUrl(blobUrl);
    };

    fetchLatestFile();
  }, []);

  return (
    <a
      className="w-full sm:w-auto justify-center cursor-pointer flex items-center gap-2 border-2 py-1 px-6 text-lg border-[#AEB1B7] rounded-md"
      href={fileBlobUrl || '#'}
      download={fileName}
    >
      <Bookmark className="text-[#AEB1B7] font-bold text-lg" />
      {t("button2")}
    </a>
  );
};

export default DownloadLatestCV;
