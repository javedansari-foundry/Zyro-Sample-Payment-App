import React, {useCallback, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  NativeModules,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const {ZyroNavigation} = NativeModules;

type Screen =
  | 'dashboard'
  | 'shop'
  | 'detail'
  | 'cart'
  | 'checkout';

type Product = {id: string; name: string; price: string};

const PRODUCTS: Product[] = Array.from({length: 18}, (_, i) => ({
  id: `p${i + 1}`,
  name: `Mock item ${i + 1}`,
  price: `${(9.99 + i * 2.5).toFixed(2)}`,
}));

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [cart, setCart] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [checkoutNote, setCheckoutNote] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return PRODUCTS;
    }
    return PRODUCTS.filter(p => p.name.toLowerCase().includes(q));
  }, [search]);

  const addToCart = useCallback((p: Product) => {
    setCart(c => [...c, p]);
    setScreen('cart');
  }, []);

  const openP2P = () => {
    ZyroNavigation?.openP2P?.();
  };

  const openProfile = () => {
    ZyroNavigation?.openProfile?.();
  };

  const logout = () => {
    ZyroNavigation?.logout?.();
  };

  if (screen === 'dashboard') {
    return (
      <SafeAreaView style={styles.safe} testID="screen_dashboard">
        <StatusBar barStyle="dark-content" />
        <Text style={styles.h1} accessibilityLabel="Dashboard title">
          Dashboard
        </Text>
        <Text style={styles.sub}>Zyro sample — hybrid RN shell</Text>

        <Pressable
          style={styles.btn}
          onPress={openP2P}
          testID="btn_dashboard_p2p"
          accessibilityLabel="Open peer to peer transfers">
          <Text style={styles.btnText}>P2P</Text>
        </Pressable>

        <Pressable
          style={styles.btn}
          onPress={() => setScreen('shop')}
          testID="btn_dashboard_shop"
          accessibilityLabel="Open shop">
          <Text style={styles.btnText}>Shop</Text>
        </Pressable>

        <Pressable
          style={styles.btn}
          onPress={openProfile}
          testID="btn_dashboard_profile"
          accessibilityLabel="Open profile">
          <Text style={styles.btnText}>Profile</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.btnDanger]}
          onPress={() =>
            Alert.alert('Logout', 'End session?', [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Logout', onPress: logout},
            ])
          }
          testID="btn_dashboard_logout"
          accessibilityLabel="Log out of the app">
          <Text style={styles.btnText}>Logout</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (screen === 'shop') {
    return (
      <SafeAreaView style={styles.safe} testID="screen_shop_browse">
        <StatusBar barStyle="dark-content" />
        <View style={styles.rowBetween}>
          <Pressable
            onPress={() => setScreen('dashboard')}
            testID="btn_shop_back"
            accessibilityLabel="Back to dashboard">
            <Text style={styles.link}>Back</Text>
          </Pressable>
          <Text style={styles.h2} accessibilityLabel="Shop browse title">
            Shop
          </Text>
          <View style={{width: 48}} />
        </View>
        <TextInput
          placeholder="Search products"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
          testID="input_shop_search"
          accessibilityLabel="Search products"
        />
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          testID="list_shop_products"
          renderItem={({item}) => (
            <Pressable
              style={styles.row}
              onPress={() => {
                setSelected(item);
                setScreen('detail');
              }}
              testID={`shop_row_${item.id}`}
              accessibilityLabel={`Product ${item.name}`}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowMeta}>${item.price}</Text>
            </Pressable>
          )}
        />
        <Pressable
          style={styles.btnOutline}
          onPress={() => setScreen('cart')}
          testID="btn_shop_cart"
          accessibilityLabel="View shopping cart">
          <Text style={styles.btnOutlineText}>Cart ({cart.length})</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (screen === 'detail' && selected) {
    return (
      <SafeAreaView style={styles.safe} testID="screen_product_detail">
        <StatusBar barStyle="dark-content" />
        <Pressable
          onPress={() => setScreen('shop')}
          testID="btn_detail_back"
          accessibilityLabel="Back to product list">
          <Text style={styles.link}>Back</Text>
        </Pressable>
        <Text style={styles.h2}>{selected.name}</Text>
        <Text style={styles.price}>${selected.price}</Text>
        <Text style={styles.note}>
          Primary action intentionally omits testID (text + pressable only) for
          locator variation.
        </Text>
        <Pressable style={styles.btn} onPress={() => addToCart(selected)}>
          <Text style={styles.btnText}>Add to cart</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (screen === 'cart') {
    return (
      <SafeAreaView style={styles.safe} testID="screen_cart">
        <StatusBar barStyle="dark-content" />
        <Pressable
          onPress={() => setScreen('shop')}
          testID="btn_cart_back"
          accessibilityLabel="Back to shop">
          <Text style={styles.link}>Back</Text>
        </Pressable>
        <Text style={styles.h2} accessibilityLabel="Cart title">
          Cart
        </Text>
        <FlatList
          data={cart}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          testID="list_cart_items"
          ListEmptyComponent={
            <Text style={styles.empty}>No items yet.</Text>
          }
          renderItem={({item, index}) => (
            <View style={styles.row} testID={`cart_row_${index}`}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowMeta}>${item.price}</Text>
            </View>
          )}
        />
        <Pressable
          style={[styles.btn, cart.length === 0 && styles.btnDisabled]}
          disabled={cart.length === 0}
          onPress={() => setScreen('checkout')}
          testID="btn_cart_checkout"
          accessibilityLabel="Proceed to checkout">
          <Text style={styles.btnText}>Checkout</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} testID="screen_checkout">
      <StatusBar barStyle="dark-content" />
      <Pressable
        onPress={() => setScreen('cart')}
        testID="btn_checkout_back"
        accessibilityLabel="Back to cart">
        <Text style={styles.link}>Back</Text>
      </Pressable>
      <Text style={styles.h2} accessibilityLabel="Checkout title">
        Checkout
      </Text>
      <TextInput
        placeholder="Delivery note (optional)"
        value={checkoutNote}
        onChangeText={setCheckoutNote}
        style={styles.input}
        testID="input_checkout_note"
        accessibilityLabel="Delivery note"
      />
      <Pressable
        style={styles.btn}
        onPress={() => {
          if (checkoutNote.trim().toLowerCase() === 'fail') {
            setErrorOpen(true);
            return;
          }
          setSuccessOpen(true);
        }}
        testID="btn_place_order"
        accessibilityLabel="Place order">
        <Text style={styles.btnText}>Place order</Text>
      </Pressable>

      <Modal visible={successOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard} accessibilityLabel="Order success dialog">
            <Text style={styles.modalTitle}>Order placed</Text>
            <Text style={styles.modalBody}>Mock payment succeeded.</Text>
            <Pressable
              style={styles.btn}
              onPress={() => {
                setSuccessOpen(false);
                setCart([]);
                setCheckoutNote('');
                setScreen('dashboard');
              }}
              testID="btn_order_success_ok"
              accessibilityLabel="Dismiss success">
              <Text style={styles.btnText}>OK</Text>
            </Pressable>
            <Pressable
              style={styles.btnOutline}
              onPress={() => {
                setSuccessOpen(false);
                setScreen('shop');
              }}
              testID="btn_order_success_shop"
              accessibilityLabel="Continue shopping">
              <Text style={styles.btnOutlineText}>Continue shopping</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={errorOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard} accessibilityLabel="Order error dialog">
            <Text style={styles.modalTitle}>Checkout failed</Text>
            <Text style={styles.modalBody}>
              Mock error: note &quot;fail&quot; triggers this path.
            </Text>
            <Pressable
              style={styles.btn}
              onPress={() => setErrorOpen(false)}
              testID="btn_order_error_dismiss"
              accessibilityLabel="Dismiss error">
              <Text style={styles.btnText}>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#f6f7fb', padding: 16},
  h1: {fontSize: 26, fontWeight: '700', marginBottom: 4},
  h2: {fontSize: 20, fontWeight: '700', marginVertical: 12},
  sub: {color: '#5c6470', marginBottom: 20},
  btn: {
    backgroundColor: '#1a56db',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  btnDanger: {backgroundColor: '#b42318'},
  btnDisabled: {opacity: 0.4},
  btnText: {color: '#fff', fontWeight: '600', fontSize: 16},
  btnOutline: {
    borderWidth: 1,
    borderColor: '#1a56db',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnOutlineText: {color: '#1a56db', fontWeight: '600'},
  link: {color: '#1a56db', marginBottom: 8, fontWeight: '600'},
  input: {
    borderWidth: 1,
    borderColor: '#cfd4dc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e2e5ea',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {fontSize: 16, fontWeight: '600'},
  rowMeta: {color: '#5c6470'},
  price: {fontSize: 22, fontWeight: '700', marginVertical: 8},
  note: {color: '#5c6470', marginBottom: 16, fontSize: 13},
  empty: {padding: 24, textAlign: 'center', color: '#5c6470'},
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {fontSize: 18, fontWeight: '700', marginBottom: 8},
  modalBody: {color: '#5c6470', marginBottom: 16},
});

export default App;
