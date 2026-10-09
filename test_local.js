const anonKey = "sb_publishable_eCPI8juOiONzGNSh2-VXpQ_8Omjcg8O";

async function run() {
  const loginRes = await fetch("https://jawziowhnzdimoecfyhb.supabase.co/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: {
      "apikey": anonKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: "rian29062006@gmail.com", password: "12345678" })
  });
  const data = await loginRes.json();
  console.log("Login:", data.access_token ? "Success" : data);

  if (data.access_token) {
    const cookie = `sb-jawziowhnzdimoecfyhb-auth-token=["${data.access_token}","${data.refresh_token}","","",""]`;
    const pageRes = await fetch("https://taskly-beige-two.vercel.app/", {
      headers: { 
        "Cookie": cookie,
        "RSC": "1"
      }
    });
    console.log("Vercel RSC Status:", pageRes.status);
    const text = await pageRes.text();
    console.log("RSC text length:", text.length);
    if (text.includes("Error") || text.includes("error")) {
      console.log("FOUND ERROR IN RSC!");
      console.log(text);
    }
  }
}
run();
