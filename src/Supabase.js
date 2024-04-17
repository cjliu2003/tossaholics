import { createClient } from "@supabase/supabase-js";

//const supabaseUrl = "https://eopcmsfwjlwtkpvwpxkg.supabase.co"
//const supabaseUrl = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcGNtc2Z3amx3dGtwdndweGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyOTA1NDksImV4cCI6MjAyODg2NjU0OX0.l1JZ5kyBQqDo_6yfNH-lBeiuRpzkoNiXekp0itmWv94"

export const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);