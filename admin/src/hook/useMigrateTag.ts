import { useState } from "react";

const useMigrateTag = () => {
  const [tagStart, setTagStart] = useState<number>(1);
  const [tagEnd, setTagEnd] = useState<number>(5);
  const [tagBatch, setTagBach] = useState<number>(100);
  const [tagRestApi, setTagRestApi] = useState<string>('');

  const handleTagStartPage = async (value: number) => {
    setTagStart(value);
  };
  const handleTagEndPage = async (value: number) => {
    setTagEnd(value);
  };
  const handleTagBatch = async (value: number) => {
    setTagBach(value);
  };
  const handleTagRestApi = async (value: string) => {
    setTagRestApi(value);
  };

  return {
    tagBatch,
    tagStart,
    tagEnd,
    tagRestApi,
    handleTagBatch,
    handleTagStartPage,
    handleTagEndPage,
    handleTagRestApi
  };
};

export default useMigrateTag;
