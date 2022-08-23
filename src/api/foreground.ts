import { Module, ModuleFunction } from "./module";

// import modules
import permissionsModule from "./modules/permissions";
import permissions from "./modules/permissions/permissions.foreground";
import activeAddressModule from "./modules/active_address";
import activeAddress from "./modules/active_address/active_address.foreground";
import allAddressesModule from "./modules/all_addresses";
import allAddresses from "./modules/all_addresses/all_addresses.foreground";
import publicKeyModule from "./modules/public_key";
import publicKey from "./modules/public_key/public_key.foreground";
import walletNamesModule from "./modules/wallet_names";
import walletNames from "./modules/wallet_names/wallet_names.foreground";

/** Foreground modules */
const modules: ForegroundModule<any>[] = [
  { ...permissionsModule, function: permissions },
  { ...activeAddressModule, function: activeAddress },
  { ...allAddressesModule, function: allAddresses },
  { ...publicKeyModule, function: publicKey },
  { ...walletNamesModule, function: walletNames }
];

export default modules;

/** Extended module interface */
interface ForegroundModule<T> extends Module<T> {
  /**
   * A function that runs after results were
   * returned from the background script.
   * This is optional and will be ignored if not set.
   */
  finalizer?: ModuleFunction<T>;
}
