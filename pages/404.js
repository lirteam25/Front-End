import React from 'react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';

//Internal Imports
import Style from "../styles/404.module.css";

const ErrorPage = () => (
    <div className={Style.Error}>
        <NextSeo title="404 | LIR" description="Oops! It seems like you've reached a page that doesn't exist." />
        <div className={Style.Error_box}>
            <h1 className="font-large">404</h1>
            <h2 className="font-large">the club is empty <br /><span className="font-normal">don&apos;t worry, go back to the <Link className={Style.Error_colums_2_back} href={"./"}>music.</Link></span></h2>
        </div>
    </div>
);

export default ErrorPage;