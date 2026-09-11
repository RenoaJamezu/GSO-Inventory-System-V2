import { supabase } from "@/lib/supabase";
import type { StockCard, StockCardInput } from "../types";

const TABLE = "stock_cards";

export async function getStockCards(): Promise<StockCard[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .is("deleted_at", null)
    .order("item", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function getStockCard(id: number): Promise<StockCard | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function createStockCard(
  input: StockCardInput,
): Promise<StockCard> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateStockCard({
  id,
  input,
}: {
  id: number;
  input: StockCardInput;
}): Promise<StockCard> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteStockCard(id: number): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}
