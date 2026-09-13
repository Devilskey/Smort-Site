import { SearchPost } from "./SearchPost";
import { SearchUsers } from "./SearchUsers";

export interface SearchAll {
    posts: SearchPost[];
    users: SearchUsers[];
  }