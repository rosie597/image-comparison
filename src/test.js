// class MenuBar extends React.Component {
//   // props 里混合着来自各个HOC传入的属性，还有父组件传入的属性。
//   handleClickNew() {
//     const readyToReplaceProject = this.props.confirmReadyToReplaceProject(
//       this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
//     );
//     this.props.onRequestCloseFile();
//     if (readyToReplaceProject) {
//       this.props.onClickNew(this.props.canSave && this.props.canCreateNew);
//     }
//     this.props.onRequestCloseFile();
//   }
//   handleClickRemix() {
//     this.props.onClickRemix();
//     this.props.onRequestCloseFile();
//   }
//   handleClickSave() {
//     this.props.onClickSave();
//     this.props.onRequestCloseFile();
//   }
//   handleClickSaveAsCopy() {
//     this.props.onClickSaveAsCopy();
//     this.props.onRequestCloseFile();
//   }
// }

// export default compose(
//   // 国际化
//   injectIntl,
//   // 菜单
//   MenuBarHOC,
//   // react-redux
//   connect(mapStateToProps, mapDispatchToProps)
// )(MenuBar);

// function MenuBar(props) {
//   // props 里只包含父组件传入的属性
//   const { show } = props;
//   // 菜单
//   const { onClickRemix, onClickNew } = useMenuBar();
//   // 国际化
//   const { intl } = useIntl();
//   // react-redux
//   const { user } = useSelector((store) => store.user);
// }

// export default MenuBar;



