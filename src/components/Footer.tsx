import Image from "next/image";

export default function Footer() {
  return (
    <footer className="h-[10vh] flex items-center justify-center gap-2">
      <div 
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => window.open("https://clusters.xyz", "_blank")}
      >
        <Image
          src="/clusters-logo-light.png"
          alt="Clusters logo"
          width={30}
          height={30}
        />
        <span className="text-md font-bold select-none">Powered by Clusters</span>
      </div>
    </footer>
  );
}