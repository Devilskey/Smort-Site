import { ReactElement } from "react";
import { AndroidHandler } from "../../PlatformSpecificScripts/Android";
import { NavBarSmortPc } from "../../component/NavbarPc";
import { Container } from "react-bootstrap";
import { NavBarSmortMobile } from "../../component/NavbarMobile/NavbarMobile";

import Style from './SearchPage.module.scss';

export const SearchPage = (): ReactElement => {

    
    return (
      <div className={Style.Page}> 
        {!AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortPc Search={(test: string) => { }} />
        }

        <Container className={Style.SearchPageContainer}>
            <div className={Style.SearchSection}>
                <input placeholder="Search..." />
            </div>

            <div className={Style.ResultsSection}>
                <div>
                    Accounts
                </div>

                <div>
                    content
                </div>
                              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>
                              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>
                              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>
                              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>

                              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>
                              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>
                              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>              <div>
                    Accounts
                </div>

                <div>
                    content
                </div>
            </div>
        </Container>

        {AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortMobile Search={(test: string) => { }} />
        }
      </div>
    );
}