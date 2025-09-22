import { useContext } from "react";
import {
  MuiContext,
  GobalContext,
  BootstrapContext,
  SettingContext,
} from "../context/Context";

function useSetting() {
  return useContext(SettingContext);
}

function useMui() {
  return useContext(MuiContext);
}

function useGobalContext() {
  return useContext(GobalContext);
}

function useBootstrap() {
  return useContext(BootstrapContext);
}

export { useSetting, useMui, useGobalContext, useBootstrap };
