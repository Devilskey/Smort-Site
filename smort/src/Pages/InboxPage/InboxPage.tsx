import { ReactElement } from "react";
import { AndroidHandler } from "../../PlatformSpecificScripts/Android";
import { NavBarSmortPc } from "../../component/NavbarPc";
import { Container } from "react-bootstrap";
import { NavBarSmortMobile } from "../../component/NavbarMobile/NavbarMobile";

import Style from './InboxPage.module.scss';

export const InboxPage = (): ReactElement => {
    return (
      <div className={Style.Page}> 
        {!AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortPc Search={(test: string) => { }} />
        }

        <Container >
            Feed
        </Container>

        {AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortMobile Search={(test: string) => { }} />
        }
      </div>
    );
}