
import Style from './ProfileHeader.module.scss';
import { smortApi as smort } from '../../../Api/smortApi';
import { IUser } from '../../../Api/ApiObjects/IUser';
import { size } from '../../../Api/enums/sizes';
import { IMyProfile } from '../../../Api/ApiObjects/userObjects';
import { useParams } from 'react-router-dom';
import { ReactElement } from 'react';
import { useTranslation } from '../../../translations/TranslationProvider';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { EditIcon } from '../../../core/Icon';
import { Img } from '../../../core/ImprovedControls/Img';
import { FollowingData } from '../../../Api/ApiObjects/FollowingData';

export interface IProfileHeaderProps {
  user: IMyProfile | undefined,
  FollowerAmmount: FollowingData,
  Follower: boolean,
  setFollowerAmmount: React.Dispatch<React.SetStateAction<FollowingData>>,
  setFollower: React.Dispatch<React.SetStateAction<boolean>>
  setTab: React.Dispatch<React.SetStateAction<"Content" | "Ask" | "All">>

  EditUserComponent: any,
  PostCount:number
}

export const ProfileHeader = ({
  user,
  FollowerAmmount,
  Follower,
  setFollowerAmmount,
  setFollower,
  setTab,
  EditUserComponent,
  PostCount,
}: IProfileHeaderProps): ReactElement => {
  const { id } = useParams()
  const { t } = useTranslation();


  return <div className={Style.UserInfoBackground}>
    <div className={Style.UserDataComplete}>
      <div className={Style.Sticky} >
        {user ? (
          <div className={Style.UserImgSpace}>
            <Img
              
              src={`${smort.GetImageUrl(user.profilePicture, false)}&size=${size.L}`}
              alt="User profile"
              width="200x"
              height="200px"
              className={Style.UserImg}
            />
          </div>
        ) : (<></>)}
        <div >
          <div className={Style.UserInfo}>
            <h3>{user ? user.username : ""}
              {(id === undefined || ( id === smort.getUser()?.id?.toString())) && (
                <>
                  <Button className={Style.EditUser} onClick={() => {
                    EditUserComponent.current?.toggleModal();
                  }}>
                    <EditIcon/>
                  </Button>

                </>
              )}
              {smort.getUser() && smort.getUser()?.username !== user?.username &&
              <>
                {Follower !== null && id !== undefined && <Button
                className={Follower ? Style.FollowButtonFollow : Style.FollowButtonNotFollowing}
                 onClick={() => {
                  if (id !== undefined && !Follower) {
                    smort.FollowUser(id);
                    const newFollowingAmount = Number(FollowerAmmount) + 1;
                    setFollowerAmmount({...FollowerAmmount, followers: newFollowingAmount} as FollowingData)
                    setFollower(true);

                  }
                  else if (id !== undefined && Follower) {
                    smort.UnfollowUser(id);
                    const newFollowingAmount = Number(FollowerAmmount) - 1;
                    setFollowerAmmount({...FollowerAmmount, followers: newFollowingAmount} as FollowingData)
                    setFollower(false);
                  }
                }}>{Follower ? t('profile.unfollow') : t('profile.follow')}</Button>}
              </>
            }
            </h3>
          

          </div>

        </div>
        </div>

    </div>
      <div className={Style.UserStats}>
          <div className={Style.UserStatItem}>
            {FollowerAmmount !== null &&
               <>
              <label> {t('profile.followers')} </label>
              <div className={Style.StateAmount}>{FollowerAmmount.followers}</div> 
              </>}
          </div>
          <div className={Style.UserStatItem}>
            <label>{t('profile.following')}  </label>
            <div className={Style.StateAmount}>  {FollowerAmmount.following}  </div>
          </div>
         <div className={Style.UserStatItem}>
            <label>{t('profile.Posts')}  </label>
            <div className={Style.StateAmount}>  {PostCount.toString()}  </div>
          </div>
      </div>
      
      <Tabs className={Style.AccountTabs} 
        defaultActiveKey="All"  
      onSelect={(eventKey) => setTab((eventKey as  "All" | "Content" | "Ask") || "All")}
        fill>
        <Tab eventKey="All" title={t('profile.tabs.All')} className={Style.Tabs}/>
        <Tab  eventKey="Content" title={t('profile.tabs.Content')} className={Style.Tabs}/>
        <Tab  eventKey="Ask" title={t('profile.tabs.Ask')} className={Style.Tabs}/>
      </Tabs>
  </div>;
}