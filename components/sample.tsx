"use client";

import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { useCertificateContract } from "@/hooks/useContract";
import { contractABI, contractAddress } from "@/lib/contract";

const SampleIntegration = () => {
  const { isConnected } = useAccount();
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [certificateId, setCertificateId] = useState("");

  const { certificateCount, actions, state } = useCertificateContract();

  const { data: certData } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getCertificate",
    args: certificateId ? [BigInt(certificateId)] : undefined,
    query: { enabled: !!certificateId },
  });

  const handleIssue = async () => {
    if (!studentName || !courseName) return;
    await actions.issueCertificate(studentName, courseName);
    setStudentName("");
    setCourseName("");
  };

  if (!isConnected) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-xl text-center">
          <h2 className="text-2xl font-semibold">Certificate DApp</h2>
          <p className="text-gray-300 mt-2">Please connect your wallet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to- from-[#0f0f0f] to-[#1b1b1b] text-white">
      <div className="max-w-2xl mx-auto space-y-10">

        <h1 className="text-4xl font-bold text-center">🎓 Certificate DApp</h1>

        {/* Stats Card */}
        <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/10 shadow-lg">
          <p className="text-gray-300 text-sm">Total Certificates Issued</p>
          <p className="text-4xl font-bold mt-2">{certificateCount}</p>
        </div>

        {/* Issue Certificate */}
        <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/10 shadow-lg space-y-4">
          <h2 className="text-2xl font-semibold mb-2">Issue Certificate</h2>

          <input
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />

          <input
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />

          <button
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
            onClick={handleIssue}
            disabled={state.isLoading}
          >
            {state.isLoading ? "Issuing..." : "Issue Certificate"}
          </button>
        </div>

        {/* View Certificate */}
        <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/10 shadow-lg space-y-4">
          <h2 className="text-2xl font-semibold mb-2">View Certificate</h2>

          <input
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter Certificate ID"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
          />

          {certData && (
            <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
              <p><strong>Name:</strong> {String(certData[0])}</p>
              <p><strong>Course:</strong> {String(certData[1])}</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(Number(certData[2]) * 1000).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Transaction Hash */}
        {state.hash && (
          <div className="backdrop-blur-xl bg-white/10 p-4 border border-white/10 rounded-2xl">
            <p className="text-sm text-gray-300">Transaction Hash:</p>
            <p className="break-all mt-1">{state.hash}</p>
          </div>
        )}

        {/* Error */}
        {state.error && (
          <div className="p-4 border border-red-500 rounded-xl text-red-400 bg-red-500/10">
            Error: {state.error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SampleIntegration;
