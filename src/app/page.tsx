'use client'

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClaimModal from "@/components/ClaimModal";

export default function Home() {
  const [isWalletConnectModalOpen, setIsWalletConnectModalOpen] = useState(false);
  const [clusterName, setClusterName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { address } = useAccount();

  const fetchClusterName = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.clusters.xyz/v1/names/address/${address}?testnet=true`);
      const data = await response.json();
      if (!data.clusterName) return;
      setClusterName(data.clusterName);
    } catch (error) {
      console.error('Error fetching cluster name:', error);
      setClusterName(null);
    } finally {
      setIsLoading(false);
    }
  }, [address, setClusterName]);

  useEffect(() => {
    fetchClusterName();
  }, [fetchClusterName]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col bg-[url('/background.png')] bg-fixed bg-no-repeat bg-cover">
        <Header 
          isWalletConnectModalOpen={isWalletConnectModalOpen} 
          setIsWalletConnectModalOpen={setIsWalletConnectModalOpen}
          clusterName={clusterName}
          setClusterName={setClusterName}
        />
        <main className="h-[90vh] flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[url('/background.png')] bg-fixed bg-no-repeat bg-cover">
      <Header 
        isWalletConnectModalOpen={isWalletConnectModalOpen} 
        setIsWalletConnectModalOpen={setIsWalletConnectModalOpen}
        clusterName={clusterName}
        setClusterName={setClusterName}
      />
        <main className="h-[90vh] flex flex-col items-center justify-center">
          { clusterName ? 
            <Image 
              src="/notwrjo.png" 
              alt="logo" 
              width={420} 
              height={420} 
              className="rounded-full select-none w-3/4 md:w-auto max-w-[420px] hover:cursor-pointer transition-transform hover:scale-105"
              onClick={() => window.open(`https://testnet.clusters.xyz/cypherpunks`, '_blank')}
            />
          :
            <ClaimModal 
              setClusterName={setClusterName} 
              setIsWalletConnectModalOpen={setIsWalletConnectModalOpen}
            />
          }
        </main>
      <Footer />
    </div>
  );
}