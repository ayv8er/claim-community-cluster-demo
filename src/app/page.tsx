'use client'

import { useState, useCallback } from "react";
import { useClusterNameQuery } from "../hooks/useClusterNameQuery";
import BackgroundLayout from "../components/BackgroundLayout";
import ClaimModal from "../components/ClaimModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { siteConfig } from "../config/site";
import Image from "next/image";

export default function Home() {
  const [isWalletConnectModalOpen, setIsWalletConnectModalOpen] = useState(false);
  const { data: clusterName, isLoading } = useClusterNameQuery();
  const clustersCommunityName = process.env.NEXT_PUBLIC_CLUSTERS_COMMUNITY_NAME;
  const clustersTestnetWebUrl = siteConfig.baseUrls.testnet;

  const handleClickClusterLogo = useCallback(() => {
    if (clustersTestnetWebUrl) {
      window.open(`${clustersTestnetWebUrl}/${clustersCommunityName}`, '_blank');
    }
  }, [clustersTestnetWebUrl, clustersCommunityName]);

  return (
    <BackgroundLayout>
      <Header 
        isWalletConnectModalOpen={isWalletConnectModalOpen} 
        setIsWalletConnectModalOpen={setIsWalletConnectModalOpen}
      />
      <main className="h-[90vh] flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="text-2xl font-bold">Loading...</div>
        ) : clusterName ? (
          <Image 
            src="/notwrjo.png" 
            alt="logo" 
            width={420} 
            height={420} 
            className="rounded-full select-none w-3/4 md:w-auto max-w-[420px] hover:cursor-pointer transition-transform hover:scale-105"
            onClick={handleClickClusterLogo}
          />
        ) : (
          <ClaimModal setIsWalletConnectModalOpen={setIsWalletConnectModalOpen} />
        )}
      </main>
      <Footer />
    </BackgroundLayout>
  );
}