interface AdsByGoogle {
  push: (params: unknown) => void;
  push?: (params: unknown) => void;
}

interface Window {
  adsbygoogle: AdsByGoogle[];
}
