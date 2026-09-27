const supabaseUrl = "https://gxjevqmqgzmgjejncrvh.supabase.co";
const supabaseKey = "sb_publishable_7m1tvgrp7m3oVTWNmPWsqg_20JxwSRa";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

console.log("Supabase connection initialized");