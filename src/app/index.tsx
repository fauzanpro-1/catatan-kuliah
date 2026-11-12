import { useEffect, useState } from 'react';

import {
  Alert,
  Button,
  FlatList,
  Text,
  TextInput,
  View,
  StyleSheet
} from 'react-native';

import { migrate } from './dbb/database';
import * as notes from './services/noteService';

export default function Home() {

  const [list, setList] = useState<notes.Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  // Mengambil semua catatan
  const load = () => {
    const data = notes.getAll();
    setList(data);
  };

  // Membuat database saat halaman dibuka
  useEffect(() => {
    migrate();
    load();
  }, []);

  // Menyimpan atau mengubah catatan
  const save = () => {

    if (title.trim().length < 3) {
      Alert.alert(
        'Validasi',
        'Judul minimal 3 karakter'
      );
      return;
    }

    if (editId !== null) {

      notes.update(
        editId,
        title.trim(),
        content.trim()
      );

      Alert.alert('Berhasil', 'Catatan berhasil diubah');

    } else {

      notes.create(
        title.trim(),
        content.trim()
      );

      Alert.alert('Berhasil', 'Catatan berhasil ditambahkan');
    }

    setTitle('');
    setContent('');
    setEditId(null);

    load();
  };

  // Mengedit catatan
  const editNote = (item: notes.Note) => {
    setEditId(item.id);
    setTitle(item.title);
    setContent(item.content || '');
  };

  // Menghapus catatan
  const deleteNote = (id: number) => {

    Alert.alert(
      'Konfirmasi',
      'Apakah kamu yakin ingin menghapus catatan?',
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            notes.remove(id);
            load();
          }
        }
      ]
    );
  };

  return (

    <View style={styles.container}>

      <Text style={styles.heading}>
        Catatan Kuliah
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Masukkan judul catatan"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Masukkan isi catatan"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <Button
        title={editId !== null ? 'Simpan Perubahan' : 'Tambah Catatan'}
        onPress={save}
      />

      <Text style={styles.subheading}>
        Daftar Catatan
      </Text>

      <FlatList
        data={list}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Belum ada catatan.
          </Text>
        }
        renderItem={({ item }) => (

          <View style={styles.card}>

            <Text style={styles.noteTitle}>
              {item.title}
            </Text>

            <Text style={styles.noteContent}>
              {item.content}
            </Text>

            <View style={styles.buttonRow}>

              <View style={styles.button}>
                <Button
                  title="Edit"
                  onPress={() => editNote(item)}
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="Hapus"
                  color="red"
                  onPress={() => deleteNote(item.id)}
                />
              </View>

            </View>

          </View>

        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
    paddingTop: 56,
    backgroundColor: '#ffffff'
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },

  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12
  },

  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10
  },

  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    marginBottom: 12
  },

  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },

  noteContent: {
    fontSize: 14,
    marginBottom: 10
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10
  },

  button: {
    flex: 1
  },

  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray'
  }

});