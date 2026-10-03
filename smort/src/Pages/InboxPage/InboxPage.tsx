import { ReactElement, useEffect, useState } from "react";
import { AndroidHandler } from "../../PlatformSpecificScripts/Android";
import { NavBarSmortPc } from "../../component/NavbarPc";
import { Container, Spinner } from "react-bootstrap";
import { NavBarSmortMobile } from "../../component/NavbarMobile/NavbarMobile";
import { smortApi as smort } from "../../Api/smortApi";

import Style from './InboxPage.module.scss';
import { InboxFeed } from "../../Api/ApiObjects/InboxFeed";
import { Link } from "react-router-dom";
import { Img } from "../../core/ImprovedControls/Img";
import { size } from "../../Api/enums/sizes";
import { useTranslation } from "../../translations/TranslationProvider";

export const InboxPage = (): ReactElement => {

  const [inboxFeed, setInboxFeed] = useState<InboxFeed[]|undefined>(undefined);
  const lang = window.localStorage.getItem("language");
  const {t} = useTranslation();

    useEffect(() => {
      document.title =  "Inbox page - Smort";
      smort.GetInboxFeed().then((inboxFeed) => {
        setInboxFeed(inboxFeed.reverse());
        if(inboxFeed.find(item => item.hasSeen === false)) {
        
          smort.InboxSetSeen().catch((error) => {
            console.error("Failed to set inbox feed as seen:", error);
          });
        }

      }).catch((error) => {
        console.error("Failed to fetch inbox feed:", error);
      });

    }, []);



    const translateNotification = (text:string) => {
    
    
      const separatorIndex = text.indexOf(":");
    
      if (separatorIndex === -1) {
        return t(text) || text;
      }
    
      const key = text.substring(0, separatorIndex);
      const value = text.substring(separatorIndex + 1);
    
      let translated = t(key);
    
      if (!translated) {
        return text;
      }
    
      translated = translated.replaceAll("{@}", value);
    
      return translated;
    };

    return (
      <div className={Style.Page}> 
        {!AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortPc Search={(test: string) => { }} />
        }

            {inboxFeed === undefined ? <div  className={Style.spinnerContainer}><Spinner className={Style.spinner}/> </div> : inboxFeed.map((item, idx) => (
                <div key={idx} className={`${Style.InboxItem} ${item.hasSeen == false && Style.Unseen}`}>
                    <div className={Style.InboxImg} >
                      <Link className={Style.FollowItem} to={`/account/${item.notificationFromUser}`} draggable="false">
                        <Img width="60" height="60" 
                        src={`${smort.GetProfilePictureImageUrl(item.notificationFromUser)}&size=${size.S}`} 
                        srcSet={`
                          ${smort.GetProfilePictureImageUrl(item.notificationFromUser)}&size=${size.L} 1000w,
                          ${smort.GetProfilePictureImageUrl(item.notificationFromUser)}&size=${size.M} 720w,
                        	${smort.GetProfilePictureImageUrl(item.notificationFromUser)}&size=${size.S} 480w`}
                        draggable="false" />
                      </Link>
                    </div>
                    <div>
                      <div>{translateNotification(item.text)}</div>
                  <div className={Style.dateText}>{new Date(item.createdAt).toLocaleString(lang ?? "en-EN")}</div>

                    </div>
                </div>
            ))}

        {AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortMobile Search={(test: string) => { }} />
        }
      </div>
    );
}


