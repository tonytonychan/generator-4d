interface Website {
  website: string;
  username: string;
  password: string;
  pin: string;
  kodeAgen: string;
  baseURL: string;
  pasaran: { [nama_pasaran: string]: string };
}

export type { Website };
