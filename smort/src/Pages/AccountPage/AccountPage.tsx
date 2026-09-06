
import { createRef, ReactElement, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";

import { smortApi as smort } from "../../Api/smortApi";
import { IMyProfile } from "../../Api/ApiObjects/userObjects";
import { NavBarSmortPc } from "../../component/NavbarPc";

import Style from "./AccountPage.module.scss";
import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects";
import { AndroidHandler } from "../../PlatformSpecificScripts/Android";
import { NavBarSmortMobile } from "../../component/NavbarMobile/NavbarMobile";
import { EditUserDataModalHandle, EditUserDataModal } from "../../component/Modals/EditUserData/EditUserData.Modal";
import { UploadContentModalHandle, UploadContentModal } from "../../component/Modals/UploadContent/UploadContent.Modal";
import { ProfileHeader } from "./Components/ProfileHeader";
import { ThumbnailCard } from "../../component/ThumbnailCard/ThumbnailCard";
import { UploadIcon } from "../../icons/Interections.icon";
import {PlusIcon} from "../../core/Icon";


export const AccountPage = (): ReactElement => {
  const [user, setUser] = useState<IMyProfile>();
  const { id } = useParams()
  const [ContentList, SetContentList] = useState<ThumbnailObject[] | null>(null);
  const [Follower, setFollower] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);

  const [FollowerAmmount, setFollowerAmmount] = useState<string | null>(null);
  const EditUserComponent = createRef<EditUserDataModalHandle>();
  const UploadContentComponent = useRef<UploadContentModalHandle>(null);
  const CreateAskQuestionComponent = useRef<UploadContentModalHandle>(null);

  useEffect(() => {
    if (id !== undefined) {
      smort.GetProfileAsync(Number(id))
        .then((profile: any) => {
          profile.id = id;
          setUser(profile)
        })
        .catch((error) => console.error("Failed to fetch profile:", error));
    }
    else  if (smort.getUser() ===  undefined) {

      smort.GetMyProfileAsync()
        .then((profile) => setUser(profile))
        .catch((error) => setUser(undefined));
    }
    else {
      setUser(smort.getUser())
    }

    if (id !== undefined) {
      smort.GetUsersContent(Number(id)).then((data: ThumbnailObject[]) => {
        SetContentList(data);
      })
      smort.GetFollowersAsync(id).then((FollowerAmmount: string) => {
        setFollowerAmmount(FollowerAmmount)
      })

      smort.AlreadyFollowing(id).then((FollowerAlready: boolean) => {
        setFollower(FollowerAlready);
      })

    }
    else {

      smort.GetMyContent().then((data: ThumbnailObject[]) => {
        SetContentList(data);
      })
      smort.GetMyFollowersAsync().then((FollowerAmmount: string) => {
        setFollowerAmmount(FollowerAmmount)
      })
    }
  }, []);


  const Search = (search: string) => {
    console.log(search);
  }

  const isThisUser = ():boolean => {
    var LoggedinUser = smort.getUser();
    if(LoggedinUser !== undefined){

       if(id === undefined || id === null){
        return true
       }
       if(id === LoggedinUser.id?.toString()){
          return true;
       }
    }
      //  user !== undefined ||  id === user?.id?.toString()

    return false
  }

  return (
    <>
      <EditUserDataModal ref={EditUserComponent} user={smort.getUser()!} />
      <UploadContentModal ref={UploadContentComponent} isAskMeAhead={false} />
      <UploadContentModal ref={CreateAskQuestionComponent} isAskMeAhead />

      <div className={Style.Page}>
        {!AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortPc Search={Search} />
        }
        {/** Users Information */}
       <div className={Style.Scroll}>

        <ProfileHeader
          user={user}
          FollowerAmmount={FollowerAmmount}
          Follower={Follower}
          setFollowerAmmount={setFollowerAmmount}
          setFollower={setFollower}
          EditUserComponent={EditUserComponent}
          PostCount={ContentList?.length ?? 0} />


          {(isThisUser() && !AndroidHandler.IsUsingAndroid()) &&
            <div className={Style.CreateContent}>
              <Button className={Style.EditUser} onClick={() => {
                  setDeleteMode(!deleteMode)
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg> 
              </Button>

              <Button className={Style.uploadContent} onClick={() => {
                UploadContentComponent.current?.toggleModal();
              }}>
                Create Post <PlusIcon />
              </Button>
            </div>
          }

          <Container>
            <Row xs={3} md={3} className="g-2" >
              {  ContentList == null && <div className={Style.loading}><Spinner/></div> }
              {ContentList?.filter((item) => item.Type != "Ask").map((item: ThumbnailObject, idx) => (
                <ThumbnailCard Post={item} deleteMode={deleteMode} />
              ))}
            </Row>
          </Container>


        </div>
        {
          AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortMobile Search={Search} />
        }
      </div >
    </>
  )
}