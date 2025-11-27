"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { contractABI, contractAddress } from "@/lib/contract";

export interface CertificateRecord {
  studentName: string;
  courseName: string;
  dateIssued: number;
}

export interface ContractState {
  isLoading: boolean;
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  hash: `0x${string}` | undefined;
  error: Error | null;
}

export interface ContractActions {
  issueCertificate: (student: string, course: string) => Promise<void>;
  fetchCertificate: (id: number) => Promise<CertificateRecord | null>;
}

export const useCertificateContract = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const { data: certificateCount, refetch: refetchCertificateCount } =
    useReadContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "certificateCount",
    });

  const { writeContractAsync, data: hash, error, isPending } =
    useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      refetchCertificateCount();
    }
  }, [isConfirmed, refetchCertificateCount]);

  const issueCertificate = async (student: string, course: string) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "issueCertificate",
        args: [student, course],
      });
    } catch (err) {
      console.error("Error issuing certificate:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCertificate = async (
    id: number
  ): Promise<CertificateRecord | null> => {
    try {
      const result = await useReadContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "getCertificate",
        args: [BigInt(id)],
      });
      return null; // wagmi useReadContract cannot be awaited directly — UI uses separate hook
    } catch (err) {
      console.error("Error fetching certificate:", err);
      return null;
    }
  };

  const state: ContractState = {
    isLoading: isLoading || isPending || isConfirming,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error: error ?? null,
  };

  return {
    certificateCount: certificateCount
      ? Number(certificateCount as bigint)
      : 0,
    actions: { issueCertificate, fetchCertificate },
    state,
  };
};
