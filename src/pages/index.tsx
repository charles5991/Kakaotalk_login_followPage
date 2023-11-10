import Kakao from "next-auth/providers/kakao";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Kakao Login App</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://developers.kakao.com/sdk/js/kakao.js" async />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-bl from-indigo-900 via-indigo-400 to-indigo-900">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            KakaoTalk <span className="text-[hsl(280,100%,70%)]">Login</span>{" "}
            App
          </h1>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (sessionData) {
      // Render the KakaoTalk channel add button script when the user is authenticated
      const script = document.createElement("script");
      script.innerHTML = `
        window.kakaoAsyncInit = function() {
          Kakao.Channel.createAddChannelButton({
            container: '#kakao-talk-channel-add-button',
          });
        };
      
        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.channel.min.js';
          js.integrity = 'sha384-bg2pMhokxyx1zeEM2ol2hJtBagKMjRIZDVI/KITe+j2U5K+Or6HPY1lWDWY8ubEN';
          js.crossOrigin = 'anonymous';
          fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'kakao-js-sdk');
      `;
      document.body.appendChild(script);
    }
  }, [sessionData]);

  const handleMobileLogin = async () => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      // Check if the user is on a mobile device
      const kakaoTalkAppLink = "kakaotalk://login"; // Deep link to KakaoTalk login

      // Redirect the user to the KakaoTalk app for login
      window.location.href = kakaoTalkAppLink;
    } else {
      try {
        // Trigger web login using NextAuth.js and wait for it to complete
        await signIn();
      } catch (error) {
        // Handle the error if there is any
        console.error("Error during sign-in:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && (
          <>
            {" "}
            <div className="mb-20 flex justify-center">
              <div
                id="kakao-talk-channel-add-button"
                data-channel-public-id="_ZeUTxl"
                data-size="large"
                data-support-multiple-densities="true"
              ></div>
            </div>
            <span className="text-md ">
              <p className="text-sm"> Logged in as </p>
              <p className="font-mono uppercase "> {sessionData.user?.name}</p>
            </span>
          </>
        )}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : handleMobileLogin}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
