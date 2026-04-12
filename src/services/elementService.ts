import { supabase } from '../lib/supabase';
import { EvaluationMethod } from '../types/evaluation';

export const elementService = {
  async getElements(): Promise<EvaluationMethod[]> {
    if (!supabase) throw new Error('Supabase no está configurado');
    
    const { data, error } = await supabase
      .from('elements')
      .select('*');
      
    if (error) throw error;
    return data as EvaluationMethod[];
  },

  async saveElement(element: EvaluationMethod): Promise<EvaluationMethod> {
    if (!supabase) throw new Error('Supabase no está configurado');

    // Upsert inserta si no existe, o actualiza si el ID ya existe
    const { data, error } = await supabase
      .from('elements')
      .upsert(element)
      .select()
      .single();

    if (error) throw error;
    return data as EvaluationMethod;
  },

  async deleteElement(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase no está configurado');

    const { error } = await supabase
      .from('elements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async resetToInitial(initialMethods: EvaluationMethod[]): Promise<EvaluationMethod[]> {
    if (!supabase) throw new Error('Supabase no está configurado');

    // 1. Borrar todos los elementos existentes
    const { error: deleteError } = await supabase
      .from('elements')
      .delete()
      .neq('id', '0'); // Un truco para borrar todos los registros
      
    if (deleteError) throw deleteError;

    // 2. Insertar los elementos iniciales
    const { data, error: insertError } = await supabase
      .from('elements')
      .insert(initialMethods)
      .select();

    if (insertError) throw insertError;
    return data as EvaluationMethod[];
  }
};
