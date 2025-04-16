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

  const { address } = useAccount();

  const fetchClusterName = useCallback(async () => {
    try {
      const response = await fetch(`https://api.clusters.xyz/v1/names/address/${address}`);
      const data = await response.json();
      if (data.clusterName && data.walletName) {
        setClusterName(data.clusterName + '/' + data.walletName);
      }
      if (data.clusterName && !data.walletName) {
        setClusterName(data.clusterName + '/');
      }
      if (!data.clusterName && data.walletName) {
        setClusterName('/' + data.walletName);
      }
      if (!data.clusterName && !data.walletName) {
        setClusterName(null);
      }
    } catch (error) {
      console.error('Error fetching cluster name:', error);
    }
  }, [address, setClusterName]);

  useEffect(() => {
    if (address) {
      fetchClusterName();
    }
  }, [address, fetchClusterName]);

  return (
    <div className="h-screen flex flex-col bg-[url('/background.png')] bg-fixed bg-no-repeat bg-cover">
      <Header 
        isWalletConnectModalOpen={isWalletConnectModalOpen} 
        setIsWalletConnectModalOpen={setIsWalletConnectModalOpen}
        clusterName={clusterName || 'Unnamed'}
      />
        <main className="h-[90vh] flex flex-col items-center justify-center">
          { clusterName ? 
            <Image 
              src="/notwrjo.png" 
              alt="logo" 
              width={420} 
              height={420} 
              className="rounded-full select-none w-3/4 md:w-auto max-w-[420px]"
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