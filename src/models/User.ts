interface AchievedPeak {
  peakId: string;
  imgData: [{ url: string; publicId: string }];
}

export interface User {
  _id: string;
  name: string;
  surname: string;
  nick: string;
  password: string;
  peaksAchieved: AchievedPeak[];
  createdAt: string;
  updatedAt: string;
}
