import React from "react";
import Skeleton from "react-loading-skeleton";
import { BrowserView, MobileView } from "react-device-detect";

function HomeCardSkeleton() {
  return (
    <>
      <BrowserView className="row" style={{
        cursor:"wait"
      }}>
        <div className="col-lg-3 col-md-6 col-sm-12 my-3">
          <Skeleton height={190} width={280} />
          <Skeleton count={1} height={40} />
          <Skeleton count={1} height={60} />
          <Skeleton count={1} height={70} />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 my-3">
          <Skeleton height={190} width={280} />
          <Skeleton count={1} height={40} />
          <Skeleton count={1} height={60} />
          <Skeleton count={1} height={70} />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 my-3">
          <Skeleton height={190} width={280} />
          <Skeleton count={1} height={40} />
          <Skeleton count={1} height={60} />
          <Skeleton count={1} height={70} />
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 my-3">
          <Skeleton height={190} width={280} />
          <Skeleton count={1} height={40} />
          <Skeleton count={1} height={60} />
          <Skeleton count={1} height={70} />
        </div>
      </BrowserView>
      <MobileView>
        <div className="col-lg-3 col-md-6 col-sm-12 my-3">
          <Skeleton height={190} />
          <Skeleton count={1} height={40} />
          <Skeleton count={1} height={60} />
          <Skeleton count={1} height={70} />
        </div>
      </MobileView>
    </>
  );
}

export default HomeCardSkeleton;
