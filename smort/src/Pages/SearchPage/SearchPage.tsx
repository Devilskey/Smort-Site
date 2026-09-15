import { ReactElement, useEffect, useRef, useState, useTransition } from "react";
import { AndroidHandler } from "../../PlatformSpecificScripts/Android";
import { NavBarSmortPc } from "../../component/NavbarPc";
import { Container, Spinner } from "react-bootstrap";
import { NavBarSmortMobile } from "../../component/NavbarMobile/NavbarMobile";

import Style from './SearchPage.module.scss';
import { smortApi as smort } from "../../Api/smortApi";
import { SearchAll } from "../../Api/ApiObjects/SearchAll";
import { Link } from "react-router-dom";
import { handleDragScroll } from "../../core/DragScroll";
import { Img } from "../../core/ImprovedControls/Img";
import { size } from "../../Api/enums/sizes";
import { PostList } from "../../component/PostItemComponent/PostList";
import { ContentItem } from "../../Api/ApiObjects/ContentObject";
import { useTranslation } from "../../translations/TranslationProvider";

export const SearchPage = (): ReactElement => {
    const [isSearching , setIsSearching] = useState(true);
    const [results , setResults] = useState<SearchAll>({ postsResults: [], userResults: [] });
    const [query , setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const scrollRef = useRef(null);

    const { t } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => {
          setDebouncedQuery(query);
        }, 500);

        return () => clearTimeout(timer);

    });
    
    useEffect(() => {
        if (!debouncedQuery.trim()) return; 

        console.log("Searching for:", debouncedQuery);  
        setIsSearching(true);

        smort.SearchAll(debouncedQuery)
            .then(async (response) => {
                setResults(response);
                console.log("Search results:", await response);
                setIsSearching(false);
            })
            .catch((error) => {
                console.error("Error searching:", error);
                setIsSearching(false);
            });

    }, [debouncedQuery]);
    
    return (
      <div className={Style.Page}> 
        {!AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortPc Search={(test: string) => { }} />
        }

        <Container className={Style.SearchPageContainer}>
            <div className={Style.SearchSection}>
                <input
                    placeholder={t("search.placeholder")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className={Style.ResultsSection}>
                {(isSearching && query !== "" )&& <div  className={Style.spinnerContainer}><Spinner className={Style.spinner}/> </div>}

                {(!isSearching && query !== "" )&& 
                <>
              
                  {results?.userResults.length !== 0 &&  <>
                    <div className={Style.ResultTitle}>{t("search.results.users")}: {results.userResults.length} </div>
                    <div className={Style.FollowingsMenu}>
                      <div className={Style.Followings} ref={scrollRef} onDrag={() => handleDragScroll(scrollRef)}>
                        { results.userResults.map((user, idx) =>
                          <>
                            <Link className={Style.FollowItem} to={`/account/${user.id}`} draggable="false">
                              <Img width="100" height="100" 
                              src={`${smort.GetImageUrl(user.profilePicture, false)}&size=${size.S}`} 
                              srcSet={`
                                ${smort.GetImageUrl(user.profilePicture, false)}&size=${size.L} 1000w,
                                ${smort.GetImageUrl(user.profilePicture, false)}&size=${size.M} 720w,
                              	${smort.GetImageUrl(user.profilePicture, false)}&size=${size.S} 480w`}
                              draggable="false" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>

                    </>
                  }
  

                   {results?.postsResults.length !== 0 &&  <>
                      <div className={Style.ResultTitle}>{t("search.results.posts")}: {results.postsResults.length} </div>
                      <PostList posts={results.postsResults as any as ContentItem[]} loading={false} />
                  </>}
                 </>
                }
            </div>
        </Container>

        {AndroidHandler.AndroidNavBarNeeded() &&
          <NavBarSmortMobile Search={(test: string) => { }} />
        }
      </div>
    );
}