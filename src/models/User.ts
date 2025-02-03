import Club from "./Club";

type User = {
  id: number;
  email: string;
  slack_name: string;
  created_at: Date;
  updated_at: Date;
  clubs: Club[];
  image: string | undefined;
};

export default User;
