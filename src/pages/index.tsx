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
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
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
  const [kakaoButtonCreated, setKakaoButtonCreated] = useState(false);

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

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && (
          <>
            {" "}
            <div>
              <div
                id="kakao-talk-channel-add-button"
                data-channel-public-id="_ZeUTxl"
                data-size="large"
                data-support-multiple-densities="true"
              ></div>
            </div>
            <span className="mt-20">Logged in as {sessionData.user?.name}</span>
          </>
        )}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}