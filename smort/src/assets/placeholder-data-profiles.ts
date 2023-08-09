export interface Profile {
  UserName: string;
  UserTag: string;
  ImageUrl: string;
  FollowerCount: Number;
  LikesCount: Number;
  FollowingCount: Number;
}

export const Profiles: Profile[] = [
  {
    UserName: 'User1',
    UserTag: '1111',
    ImageUrl:
      'https://torngems.nl/wp-content/uploads/2022/11/TGLogoNoBckGrnd.png',
    FollowerCount: 1,
    LikesCount: 2,
    FollowingCount: 3,
  },
  {
    UserName: 'User2',
    UserTag: '2222',
    ImageUrl:
      'https://torngems.nl/wp-content/uploads/2022/11/TGLogoNoBckGrnd.png',
    FollowerCount: 4,
    LikesCount: 5,
    FollowingCount: 6,
  },
];
