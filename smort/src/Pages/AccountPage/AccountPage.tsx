
import { createRef, ReactElement, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Container } from "react-bootstrap";

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
    if (smort.getUser() === undefined && id === undefined) {

      smort.GetMyProfileAsync()
        .then((profile) => setUser(profile))
        .catch((error) => setUser(undefined));
    }
    else if (id !== undefined) {
      smort.GetProfileAsync(Number(id))
        .then((profile: any) => {

          setUser(profile)
        })
        .catch((error) => console.error("Failed to fetch profile:", error));
    }
    else {
      setUser(smort.getUser())
    }

    if (id !== undefined) {
      smort.GetUsersContent(Number(id)).then((data: ThumbnailObject[]) => {
        console.log(data);
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
        console.log(data);
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

  return (
    <>
      <EditUserDataModal ref={EditUserComponent} user={smort.getUser()!} />
      <UploadContentModal ref={UploadContentComponent} isAskMe={false} />
      <UploadContentModal ref={CreateAskQuestionComponent} isAskMe />


      <div className={Style.Page}>
        {!AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortPc Search={Search} />
        }
        {/** Users Information */}
        <ProfileHeader
          user={user}
          deleteMode={deleteMode}
          FollowerAmmount={FollowerAmmount}
          Follower={Follower}
          setDeleteMode={setDeleteMode}
          setFollowerAmmount={setFollowerAmmount}
          setFollower={setFollower}
          EditUserComponent={EditUserComponent} />

        <Container className={Style.Scroll}>

        </Container>
        {
          AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortMobile Search={Search} />
        }
      </div >
    </>
  )
}