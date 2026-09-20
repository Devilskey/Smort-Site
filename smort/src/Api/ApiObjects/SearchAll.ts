import { SearchPost } from "./SearchPost";
import { SearchUsers } from "./SearchUsers";

export interface SearchAll {
    postsResults: SearchPost[];
    userResults: SearchUsers[];
  }