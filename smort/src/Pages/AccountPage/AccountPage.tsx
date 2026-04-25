
import { createRef, JSX, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, Col, Container, Row } from "react-bootstrap";

import { smortApi as smort } from "../../Api/smortApi";
import { IMyProfile } from "../../Api/ApiObjects/userObjects";
import { NavBarSmortPc } from "../../component/NavbarPc";

import Style from "./AccountPage.module.scss";
import { ThumbnailObject } from "../../Api/ApiObjects/ThumbnailObjects";
import { AndroidHandler } from "../../PlatformSpecificScripts/Android";
import { NavBarSmortMobile } from "../../component/NavbarMobile/NavbarMobile";
import { UploadIcon } from "../../icons/Interections.icon";
import { ThumbnailCard } from "../../component/ThumbnailCard/ThumbnailCard";
import { size } from "../../Api/enums/sizes";
import { EditUserDataModalHandle, EditUserDataModal } from "../../component/Modals/EditUserData/EditUserData.Modal";
import { UploadContentModalHandle, UploadContentModal } from "../../component/Modals/UploadContent/UploadContent.Modal";
import { ProfileHeader } from "./Components/ProfileHeader";


export const AccountPage = (): JSX.Element => {
  const [user, setUser] = useState<IMyProfile>();
  const { id } = useParams()
  const [ContentList, SetContentList] = useState<ThumbnailObject[] | null>(null);
  const [Follower, setFollower] = useState<boolean>(false);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);

  const [FollowerAmmount, setFollowerAmmount] = useState<string | null>(null);
  const EditUserComponent = createRef<EditUserDataModalHandle>();
  const UploadContentComponent = useRef<UploadContentModalHandle>(null);
  const CreateAskQuestionComponent = useRef<UploadContentModalHandle>(null);

  // const [Navigation, SetNavigation] = useState<"Content" | "Project">("Content");

  useEffect(() => {
    // Fetch user profile only once
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

        {/* * Users Content
        <Container >
          {user !== undefined &&
            <div className={Style.CreateContent}>
              <button className={Style.uploadContent} onClick={() => {
                UploadContentComponent.current?.toggleModal();
              }}>
                Upload Video <UploadIcon />
              </button>

              <button className={Style.uploadContent} onClick={() => {
                CreateAskQuestionComponent.current?.toggleModal();
              }}>
                Ask Question
              </button>
            </div>
          }

          <div>
            <Row xs={3} md={3} className="g-2" >
              {user !== undefined &&
                <Col key={"Upload"} xs={6} sm={6} md={4} xl={3} >
                  <Card className="card">

                  </Card>
                </Col>
              }
              {ContentList?.map((item: ThumbnailObject, idx) => (
                <ThumbnailCard Post={item} deleteMode={deleteMode} />
              ))}
            </Row>
          </div>
        </Container > */}

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