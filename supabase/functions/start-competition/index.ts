import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  const { competitionId } = await req.json();

  // Update competition status to ONGOING and add updated_at for reactivity
  const { data: updatedCompetition, error } = await supabaseAdmin
    .from("competitions")
    .update({ status: "ONGOING", updated_at: new Date().toISOString() })
    .eq("id", competitionId)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // Broadcast the update to all clients
  await supabaseAdmin.channel(`competition-${competitionId}`).send({
    type: "broadcast",
    event: "competition_update",
    payload: updatedCompetition,
  });

  return new Response(JSON.stringify({ success: true, competition: updatedCompetition }), {
    status: 200,
  });
});
