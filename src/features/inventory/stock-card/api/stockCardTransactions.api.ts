import { supabase } from "@/lib/supabase";
import type { StockCardTransaction, StockCardTransactionInput } from "../types";

const TABLE = "stock_card_transactions";

export async function getStockCardTransactions(
  stockCardId: number,
): Promise<StockCardTransaction[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("stock_card_id", stockCardId)
    .is("deleted_at", null)
    .order("transaction_date", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function createStockCardTransaction(
  input: StockCardTransactionInput,
): Promise<StockCardTransaction> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateStockCardTransaction({
  id,
  input,
}: {
  id: number;
  input: StockCardTransactionInput;
}): Promise<StockCardTransaction> {
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

export async function deleteStockCardTransaction(id: number): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}
