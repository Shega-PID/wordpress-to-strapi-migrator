import { useState } from "react";

const useMigrateMedia= () => {
  const [mediaStart, setMediaStart] = useState<number>(1);
  const [mediaEnd, setMediaEnd] = useState<number>(5);
  const [mediaBatch, setMediaBach] = useState<number>(100);
  const [mediaRestApi, setMediaRestApi] = useState<string>('');

  const handleMediaStartPage = async (value: number) => {
    setMediaStart(value);
  };
  const handleMediaEndPage = async (value: number) => {
    setMediaEnd(value);
  };
  const handleMediaBatch = async (value: number) => {
    setMediaBach(value);
  };
  const handleMediaRestApi = async (value: string) => {
    setMediaRestApi(value);
  };

  return {
    mediaBatch,
    mediaStart,
    mediaEnd,
    mediaRestApi,
    handleMediaBatch,
    handleMediaStartPage,
    handleMediaEndPage,
    handleMediaRestApi
  };
};

export default useMigrateMedia
