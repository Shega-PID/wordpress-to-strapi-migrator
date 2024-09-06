import { useState } from "react";
import migrationRequest from "../api/migrate-posts-request";

export interface ResultType {
  success: boolean;
  postPerPage: string;
  startPage: string;
  lastPage: number;
  message: string;
}

const useMigrateCategory = () => {
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(5);
  const [batch, setBatch] = useState<number>(100);
  const [restApi, setRestApi] = useState<string>('');

  const handleStartPage = async (value: number) => {
    setStartPage(value);
  };
  const handleEndPage = async (value: number) => {
    setEndPage(value);
  };
  const handleBatch = async (value: number) => {
    setBatch(value);
  };
  const handleRestApi = async (value: string) => {
    setRestApi(value);
  };

  return {
    startPage,
    endPage,
    batch,
    restApi,
    handleBatch,
    handleStartPage,
    handleEndPage,
    handleRestApi
  };
};

export default useMigrateCategory;
